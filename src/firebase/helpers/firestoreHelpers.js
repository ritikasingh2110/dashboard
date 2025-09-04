// src/firestoreHelpers.js
import { db } from '../firebase';
import { collection, addDoc, getDoc, getDocs } from 'firebase/firestore';
import { doc, deleteDoc, updateDoc, setDoc } from 'firebase/firestore';

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

// Save job
export const saveJob = async (jobData) => {
  try {
    const docRef = await addDoc(jobsCollection, {
      ...jobData,
      createdAt: new Date(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error saving job:", error);
    throw error;
  }
};




