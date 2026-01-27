# Multimedia API Integration Examples

This file contains code examples for integrating the multimedia API with your frontend or other applications.

## JavaScript/TypeScript Fetch Examples

### 1. Upload Multimedia

```javascript
// Simple file upload function
async function uploadMultimedija(file, naziv, kolekcijaId, javno = false) {
  const formData = new FormData();
  formData.append("datoteka", file);
  formData.append("naziv", naziv);
  formData.append("kolekcijaId", kolekcijaId);
  formData.append("javno", javno);

  try {
    const response = await fetch("/api/multimedija", {
      method: "POST",
      body: formData,
      credentials: "include", // Include session cookies
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.greska || "Greška pri uploadu");
    }

    console.log("Multimedija uspješno učitana!", data);
    return data;
  } catch (error) {
    console.error("Upload error:", error);
    throw error;
  }
}

// Usage
const fileInput = document.querySelector('input[type="file"]');
const file = fileInput.files[0];
uploadMultimedija(file, "Moja Slika", 1, true);
```

### 2. Get Multimedia Metadata

```javascript
async function getMultimedija(id) {
  try {
    const response = await fetch(`/api/multimedija/${id}`, {
      credentials: "include",
    });

    if (response.status === 403) {
      console.error("Nemate pristupa ovoj multimediji");
      return null;
    }

    if (response.status === 404) {
      console.error("Multimedija ne postoji");
      return null;
    }

    const data = await response.json();
    console.log("Multimedija:", data);
    return data;
  } catch (error) {
    console.error("Error fetching multimedia:", error);
    throw error;
  }
}

// Usage
const multimedia = await getMultimedija(1);
if (multimedia) {
  console.log(`Tip: ${multimedia.tip}`);
  console.log(`Putanja: ${multimedia.putanja}`);
}
```

### 3. Delete Multimedia

```javascript
async function deleteMultimedija(id) {
  try {
    const response = await fetch(`/api/multimedija/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.greska || "Greška pri brisanju");
    }

    console.log("Multimedija obrisana!");
    return data;
  } catch (error) {
    console.error("Delete error:", error);
    throw error;
  }
}

// Usage
deleteMultimedija(1);
```

### 4. Update Metadata

```javascript
async function updateMultimedija(id, updates) {
  try {
    const response = await fetch(`/api/multimedija/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.greska || "Greška pri ažuriranju");
    }

    console.log("Multimedija ažurirana!");
    return data;
  } catch (error) {
    console.error("Update error:", error);
    throw error;
  }
}

// Usage
updateMultimedija(1, {
  naziv: "Novi Naziv",
  javno: true,
});
```

### 5. List All Multimedia

```javascript
async function listMultimedija() {
  try {
    const response = await fetch("/api/multimedija", {
      credentials: "include",
    });

    const multimedia = await response.json();
    console.log("Sve multimedije:", multimedia);

    // Display in table or list
    multimedia.forEach((m) => {
      console.log(`${m.naziv} (${m.tip}) - ${m.putanja}`);
    });

    return multimedia;
  } catch (error) {
    console.error("Error listing multimedia:", error);
    throw error;
  }
}

// Usage
const allMedia = await listMultimedija();
```

### 6. Complete React Component Example

```typescript
import React, { useState, useCallback } from 'react';

interface Multimedija {
  id: number;
  naziv: string;
  tip: 'slika' | 'video';
  putanja: string;
  kolekcijaId: number;
  javno: number;
  autor: string;
  datumDodavanja: string;
}

export const MultimedijaUploader: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [naziv, setNaziv] = useState('');
  const [javno, setJavno] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleUpload = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file || !naziv) {
      setError('Datoteka i naziv su obavezni');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    const formData = new FormData();
    formData.append('datoteka', file);
    formData.append('naziv', naziv);
    formData.append('kolekcijaId', '1'); // Your collection ID
    formData.append('javno', javno ? 'true' : 'false');

    try {
      const response = await fetch('/api/multimedija', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.greska || 'Greška pri uploadu');
      }

      setSuccess(true);
      setFile(null);
      setNaziv('');
      setJavno(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Greška pri uploadu');
    } finally {
      setLoading(false);
    }
  }, [file, naziv, javno]);

  return (
    <div className="uploader">
      <h2>Učitaj Multimediju</h2>

      {error && <div className="error">{error}</div>}
      {success && <div className="success">Multimedija uspješno učitana!</div>}

      <form onSubmit={handleUpload}>
        <div>
          <label>
            Datoteka:
            <input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              accept="image/*,video/*"
              disabled={loading}
            />
          </label>
        </div>

        <div>
          <label>
            Naziv:
            <input
              type="text"
              value={naziv}
              onChange={(e) => setNaziv(e.target.value)}
              disabled={loading}
            />
          </label>
        </div>

        <div>
          <label>
            Javno:
            <input
              type="checkbox"
              checked={javno}
              onChange={(e) => setJavno(e.target.checked)}
              disabled={loading}
            />
          </label>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Učitavanje...' : 'Učitaj'}
        </button>
      </form>
    </div>
  );
};
```

### 7. Complete Vue Component Example

```vue
<template>
  <div class="uploader">
    <h2>Učitaj Multimediju</h2>

    <div v-if="error" class="error">{{ error }}</div>
    <div v-if="success" class="success">Multimedija uspješno učitana!</div>

    <form @submit.prevent="handleUpload">
      <div>
        <label>
          Datoteka:
          <input
            type="file"
            @change="handleFileChange"
            accept="image/*,video/*"
            :disabled="loading"
          />
        </label>
      </div>

      <div>
        <label>
          Naziv:
          <input v-model="naziv" type="text" :disabled="loading" />
        </label>
      </div>

      <div>
        <label>
          Javno:
          <input v-model="javno" type="checkbox" :disabled="loading" />
        </label>
      </div>

      <button type="submit" :disabled="loading">
        {{ loading ? "Učitavanje..." : "Učitaj" }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const file = ref<File | null>(null);
const naziv = ref("");
const javno = ref(false);
const loading = ref(false);
const error = ref<string | null>(null);
const success = ref(false);

const handleFileChange = (e: Event) => {
  const input = e.target as HTMLInputElement;
  file.value = input.files?.[0] || null;
};

const handleUpload = async () => {
  if (!file.value || !naziv.value) {
    error.value = "Datoteka i naziv su obavezni";
    return;
  }

  loading.value = true;
  error.value = null;
  success.value = false;

  const formData = new FormData();
  formData.append("datoteka", file.value);
  formData.append("naziv", naziv.value);
  formData.append("kolekcijaId", "1");
  formData.append("javno", javno.value ? "true" : "false");

  try {
    const response = await fetch("/api/multimedija", {
      method: "POST",
      body: formData,
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.greska || "Greška pri uploadu");
    }

    success.value = true;
    file.value = null;
    naziv.value = "";
    javno.value = false;
  } catch (err) {
    error.value = err instanceof Error ? err.message : "Greška pri uploadu";
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.uploader {
  max-width: 500px;
  margin: 20px auto;
}

form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

label {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

input {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

button {
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.error {
  color: red;
  margin: 10px 0;
}

.success {
  color: green;
  margin: 10px 0;
}
</style>
```

### 8. Angular Service Example

```typescript
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";

export interface Multimedija {
  id: number;
  naziv: string;
  tip: "slika" | "video";
  putanja: string;
  kolekcijaId: number;
  javno: number;
  autor: string;
  datumDodavanja: string;
}

@Injectable({
  providedIn: "root",
})
export class MultimedijaService {
  private baseUrl = "/api/multimedija";

  constructor(private http: HttpClient) {}

  uploadMultimedija(
    file: File,
    naziv: string,
    kolekcijaId: number,
    javno: boolean = false,
  ): Observable<any> {
    const formData = new FormData();
    formData.append("datoteka", file);
    formData.append("naziv", naziv);
    formData.append("kolekcijaId", kolekcijaId.toString());
    formData.append("javno", javno ? "true" : "false");

    return this.http
      .post<any>(this.baseUrl, formData)
      .pipe(catchError(this.handleError));
  }

  getMultimedija(id: number): Observable<Multimedija> {
    return this.http
      .get<Multimedija>(`${this.baseUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  getAllMultimedija(): Observable<Multimedija[]> {
    return this.http
      .get<Multimedija[]>(this.baseUrl)
      .pipe(catchError(this.handleError));
  }

  updateMultimedija(
    id: number,
    updates: Partial<Multimedija>,
  ): Observable<any> {
    return this.http
      .put<any>(`${this.baseUrl}/${id}`, updates)
      .pipe(catchError(this.handleError));
  }

  deleteMultimedija(id: number): Observable<any> {
    return this.http
      .delete<any>(`${this.baseUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any) {
    console.error("Error:", error);
    return throwError(() => new Error(error.error?.greska || "Greška"));
  }
}
```

## cURL Examples

### Upload

```bash
curl -X POST http://localhost:12222/api/multimedija \
  -F "datoteka=@./image.jpg" \
  -F "naziv=Moja Slika" \
  -F "kolekcijaId=1" \
  -F "javno=true" \
  -b cookies.txt -c cookies.txt
```

### Get

```bash
curl http://localhost:12222/api/multimedija/1 \
  -b cookies.txt
```

### Update

```bash
curl -X PUT http://localhost:12222/api/multimedija/1 \
  -H "Content-Type: application/json" \
  -d '{"naziv":"New Title","javno":false}' \
  -b cookies.txt
```

### Delete

```bash
curl -X DELETE http://localhost:12222/api/multimedija/1 \
  -b cookies.txt
```

## Error Handling Pattern

```javascript
async function apiCall(method, endpoint, data = null) {
  try {
    const options = {
      method,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(endpoint, options);
    const result = await response.json();

    if (!response.ok) {
      switch (response.status) {
        case 400:
          throw new Error(`Loša zahtjeva: ${result.greska}`);
        case 401:
          throw new Error("Niste prijavljeni");
        case 403:
          throw new Error("Nemate dozvolu");
        case 404:
          throw new Error("Nije pronađeno");
        case 500:
          throw new Error("Greška servera");
        default:
          throw new Error(result.greska || "Nepoznata greška");
      }
    }

    return result;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}

// Usage
try {
  const result = await apiCall("GET", "/api/multimedija/1");
  console.log("Success:", result);
} catch (error) {
  console.error("Failed:", error.message);
}
```

## Tips for Integration

1. **Always include credentials:** `credentials: 'include'`
2. **Handle 401 errors:** Redirect to login if session expires
3. **Validate files before upload:** Check size and type client-side
4. **Show loading state:** Uploads can take time
5. **Provide meaningful errors:** Display `greska` field to users
6. **Use FormData:** For file uploads (don't JSON stringify)
7. **Clean up temp files:** Your backend handles this automatically
8. **Cache responses:** Consider caching multimedia list
9. **Lazy load images:** Improve performance with lazy loading
10. **Test thoroughly:** Use the test.http file before deploying

Happy coding! 🚀
