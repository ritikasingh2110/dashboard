// src/firestoreHelpers.js
import { db } from '../firebase';
import { collection, getDoc, addDoc, runTransaction ,getDocs} from 'firebase/firestore';
import { doc, deleteDoc, updateDoc, setDoc ,query , where} from 'firebase/firestore';

// Reference to the "jobApplications" collection
const jobCollection = collection(db, 'jobApplications');


// Reference to the "archivedJobApplications" collection
const archivedJobCollection = collection(db, 'archivedJobApplications');


// Save a new job application
export const saveJobApplication = async (formData) => {
  try {
    const dataWithDate = {
      ...formData,
      submissionDate: new Date().toISOString().split("T")[0], // YYYY-MM-DD format
    };
    const docRef = await addDoc(jobCollection, dataWithDate);
    console.log("Document written with ID: ", docRef.id);
    return docRef.id;
  } catch (e) {
    console.error("Error adding document: ", e);
    throw e;
  }
};

// Get all job applications
export const getAllApplications = async () => {
  try {
    const snapshot = await getDocs(jobCollection);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (e) {
    console.error("Error fetching documents: ", e);
    throw e;
  }
};

export const deleteApplication = async (id) => {
  const docRef = doc(db, 'jobApplications', id);
  await deleteDoc(docRef);
};

export const updateApplication = async (id, updatedData) => {
  const docRef = doc(db, 'jobApplications', id);
  await updateDoc(docRef, updatedData);
};

// Archive application (move to archivedJobApplications)
export const archiveApplication = async (id) => {
  try {
    const docRef = doc(db, 'jobApplications', id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      throw new Error("Application not found");
    }

    const applicationData = docSnap.data();

    // Add an archived date
    const archivedData = {
      ...applicationData,
      archivedDate: new Date().toISOString().split("T")[0],
    };

    // Save to archive collection
    await addDoc(archivedJobCollection, archivedData);

    // Delete from active collection
    await deleteDoc(docRef);

    console.log(`Application ${id} archived successfully`);
  } catch (error) {
    console.error("Error archiving application:", error);
    throw error;
  }
};


// Reference to the "admins" collection
const adminCollection = collection(db, 'admins');

export const saveAdmin = async (adminData) => {
  try {
    const docRef = doc(db, "admins", adminData.email); // use email as ID
    await setDoc(docRef, adminData);
    return docRef.id;
  } catch (error) {
    console.error("Error saving admin:", error);
    throw error;
  }
};

export const getAllAdmins = async () => {
  try {
    const snapshot = await getDocs(adminCollection);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching admins:", error);
    throw error;
  }
};

export const getAdminById = async (email) => {
  try {
    const docRef = doc(db, "admins", email);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      throw new Error("Admin not found");
    }
  } catch (error) {
    console.error("Error fetching admin:", error);
    throw error;
  }
};

// Get all archived job applications
export const getAllArchivedApplications = async () => {
  try {
    const snapshot = await getDocs(archivedJobCollection);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (e) {
    console.error("Error fetching archived documents: ", e);
    throw e;
  }
};

// Restore archived application
export const restoreApplication = async (id) => {
  try {
    const docRef = doc(db, 'archivedJobApplications', id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      throw new Error("Archived application not found");
    }

    const applicationData = docSnap.data();

    // Add back to active collection
    await addDoc(jobCollection, applicationData);

    // Delete from archive
    await deleteDoc(docRef);

    console.log(`Application ${id} restored successfully`);
  } catch (error) {
    console.error("Error restoring application:", error);
    throw error;
  }
};



const jobsCollection = collection(db, "jobs");
const counterRef = doc(db, "counters", "jobCounter"); // Document that stores last used ID


// Save job with unique serial 5-digit ID
export const saveJob = async (jobData) => {
  try {
    const newId = await runTransaction(db, async (transaction) => {
      const counterDoc = await transaction.get(counterRef);

      if (!counterDoc.exists()) {
        throw new Error("Counter document does not exist!");
      }

      const lastId = counterDoc.data().lastId || 0;
      let nextId = lastId + 1;

      if (nextId > 99999) {
        nextId = 1; // wrap around after 99999
      }

      // Update the counter
      transaction.update(counterRef, { lastId: nextId });

      // Create the job document
      const jobDocRef = doc(jobsCollection); 
      transaction.set(jobDocRef, {
        ...jobData,
        jobId: String(nextId).padStart(5, '0'),
        createdAt: new Date()
      });

      return String(nextId).padStart(5, '0');
    });

    return newId;
  } catch (error) {
    console.error("Error saving job:", error);
    throw error;
  }
};


// Fetch all jobs from 'jobs' collection
export const getAllJobs = async () => {
  try {
    const jobsCollection = collection(db, "jobs");
    const snapshot = await getDocs(jobsCollection);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return [];
  }
};


// ✅ Find a job document by jobId
const getJobDocByJobId = async (jobId) => {
  try {
    const q = query(jobsCollection, where("jobId", "==", jobId));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log(`No job found with jobId: ${jobId}`);
      return null;
    }

    // Assuming jobId is unique, take the first document
    const docSnap = querySnapshot.docs[0];
    return docSnap;
  } catch (error) {
    console.error("Error finding job by jobId:", error);
    throw error;
  }
};

// ✅ Find and return job data by jobId
export const findJobByJobId = async (jobId) => {
  const jobDoc = await getJobDocByJobId(jobId);
  if (!jobDoc) return null;
  return { id: jobDoc.id, ...jobDoc.data() };
};

// ✅ Delete job by jobId
export const deleteJobByJobId = async (jobId) => {
  const jobDoc = await getJobDocByJobId(jobId);
  if (!jobDoc) {
    throw new Error(`Job with jobId ${jobId} not found.`);
  }
  await deleteDoc(doc(db, "jobs", jobDoc.id));
  console.log(`Job with jobId ${jobId} deleted successfully.`);
};


// ✅ Update job by jobId
export const updateJobByJobId = async (jobId, updatedData) => {
  const jobDoc = await getJobDocByJobId(jobId);
  if (!jobDoc) {
    throw new Error(`Job with jobId ${jobId} not found.`);
  }
  await updateDoc(doc(db, "jobs", jobDoc.id), updatedData);
  console.log(`Job with jobId ${jobId} updated successfully.`);
};


// ✅ Example method: get all jobs by jobFunction
export const getJobsByFunction = async (jobFunction) => {
  try {
    const q = query(jobsCollection, where("jobFunction", "==", jobFunction));
    const querySnapshot = await getDocs(q);

    const jobs = querySnapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    }));

    return jobs;
  } catch (error) {
    console.error("Error retrieving jobs by function:", error);
    throw error;
  }
};


