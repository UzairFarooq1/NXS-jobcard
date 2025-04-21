// This file contains the IndexedDB implementation for offline support

export interface IDBJobCard {
  id?: number
  timestamp: number
  formData: any
  synced: boolean
}

const DB_NAME = "JobCardOfflineDB"
const STORE_NAME = "jobCards"
const DB_VERSION = 1

// Open the database
export function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = (event) => {
      reject("Error opening database")
    }

    request.onsuccess = (event) => {
      resolve(request.result)
    }

    request.onupgradeneeded = (event) => {
      const db = request.result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: "id", autoIncrement: true })
        store.createIndex("timestamp", "timestamp", { unique: false })
        store.createIndex("synced", "synced", { unique: false })
      }
    }
  })
}

// Save a job card to IndexedDB
export async function saveJobCardOffline(formData: any): Promise<number> {
  const db = await openDatabase()

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], "readwrite")
    const store = transaction.objectStore(STORE_NAME)

    const jobCard: IDBJobCard = {
      timestamp: Date.now(),
      formData,
      synced: false,
    }

    const request = store.add(jobCard)

    request.onsuccess = () => {
      resolve(request.result as number)
    }

    request.onerror = () => {
      reject("Error saving job card offline")
    }

    transaction.oncomplete = () => {
      db.close()
    }
  })
}

// Get all unsynchronized job cards
export async function getUnsyncedJobCards(): Promise<IDBJobCard[]> {
  const db = await openDatabase()

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], "readonly")
    const store = transaction.objectStore(STORE_NAME)
    const index = store.index("synced")

    const request = index.getAll(false)

    request.onsuccess = () => {
      resolve(request.result)
    }

    request.onerror = () => {
      reject("Error getting unsynced job cards")
    }

    transaction.oncomplete = () => {
      db.close()
    }
  })
}

// Mark a job card as synchronized
export async function markJobCardAsSynced(id: number): Promise<void> {
  const db = await openDatabase()

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], "readwrite")
    const store = transaction.objectStore(STORE_NAME)

    const getRequest = store.get(id)

    getRequest.onsuccess = () => {
      const jobCard = getRequest.result
      jobCard.synced = true

      const updateRequest = store.put(jobCard)

      updateRequest.onsuccess = () => {
        resolve()
      }

      updateRequest.onerror = () => {
        reject("Error marking job card as synced")
      }
    }

    getRequest.onerror = () => {
      reject("Error getting job card")
    }

    transaction.oncomplete = () => {
      db.close()
    }
  })
}

// Get all job cards
export async function getAllJobCards(): Promise<IDBJobCard[]> {
  const db = await openDatabase()

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], "readonly")
    const store = transaction.objectStore(STORE_NAME)

    const request = store.getAll()

    request.onsuccess = () => {
      resolve(request.result)
    }

    request.onerror = () => {
      reject("Error getting all job cards")
    }

    transaction.oncomplete = () => {
      db.close()
    }
  })
}

// Delete a job card
export async function deleteJobCard(id: number): Promise<void> {
  const db = await openDatabase()

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], "readwrite")
    const store = transaction.objectStore(STORE_NAME)

    const request = store.delete(id)

    request.onsuccess = () => {
      resolve()
    }

    request.onerror = () => {
      reject("Error deleting job card")
    }

    transaction.oncomplete = () => {
      db.close()
    }
  })
}
