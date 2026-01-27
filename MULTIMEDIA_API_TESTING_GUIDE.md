# Multimedia REST API - Testing Guide

## Overview

The multimedia REST API has been fully implemented with file upload, deletion, and metadata management capabilities. All endpoints include proper validation, permission checking, and error handling.

## API Endpoints

### 1. POST /api/multimedija - Upload Multimedia
**Purpose:** Upload new multimedia files (images or videos)

**Requirements:**
- User must be logged in (session required)
- File must be provided as multipart/form-data
- File types: JPEG, PNG, GIF, WebP (images), MP4, WebM, MOV (videos)
- Image size: ≤ 500 KB
- Video size: ≤ 1 MB

**Request Format:**
```
POST /api/multimedija
Content-Type: multipart/form-data
```

**Form Fields:**
- `datoteka` (file, required): The multimedia file
- `naziv` (string, required): Name/title of the multimedia
- `kolekcijaId` (number, required): ID of the collection
- `autor` (string, optional): Author name
- `javno` (boolean, optional): Whether the multimedia is public (default: false)

**Success Response:**
```json
{
  "status": "uspjeh",
  "poruka": "Multimedija uspješno učitana",
  "id": 1
}
```
Status: 201 Created

**Error Responses:**
- 401: User not logged in
- 400: Missing required fields or invalid file type/size
- 500: Server error

### 2. DELETE /api/multimedija/:id - Delete Multimedia
**Purpose:** Delete a multimedia file and its database record

**Requirements:**
- User must be logged in
- User must be owner of the collection OR admin/moderator
- The multimedia must exist

**Request Format:**
```
DELETE /api/multimedija/1
```

**Success Response:**
```json
{
  "status": "uspjeh",
  "poruka": "Multimedija uspješno obrisana"
}
```
Status: 201 Created

**Error Responses:**
- 401: User not logged in
- 403: Insufficient permissions
- 404: Multimedia not found
- 500: Server error

### 3. GET /api/multimedija/:id - Get Multimedia Metadata
**Purpose:** Retrieve metadata and path of a specific multimedia

**Requirements:**
- Session validation
- Access control based on permissions:
  - Public multimedia: accessible to everyone
  - Private multimedia: only owner, admin, or moderator

**Request Format:**
```
GET /api/multimedija/1
```

**Success Response:**
```json
{
  "id": 1,
  "naziv": "Test Slika",
  "tip": "slika",
  "putanja": "podaci/multimedija/test_slika_1234567890.jpg",
  "kolekcijaId": 1,
  "javno": 1,
  "datumDodavanja": "2025-01-27T10:30:00.000Z",
  "autor": "Test Autor"
}
```
Status: 200 OK

**Error Responses:**
- 403: Access denied
- 404: Multimedia not found
- 500: Server error

### 4. GET /api/multimedija - Get All Accessible Multimedia
**Purpose:** Retrieve all multimedia accessible to the user

**Behavior:**
- Guests: only public multimedia
- Regular users: public + their collection's multimedia
- Admin/Moderator: all multimedia

**Request Format:**
```
GET /api/multimedija
```

**Success Response:**
```json
[
  {
    "id": 1,
    "naziv": "Test Slika",
    "tip": "slika",
    "putanja": "podaci/multimedija/...",
    "kolekcijaId": 1,
    "javno": 1,
    "datumDodavanja": "2025-01-27T10:30:00.000Z",
    "autor": "Test Autor"
  }
]
```
Status: 200 OK

### 5. PUT /api/multimedija/:id - Update Multimedia Metadata
**Purpose:** Update metadata of existing multimedia

**Requirements:**
- User must be logged in
- User must be owner of collection OR admin/moderator
- The multimedia must exist

**Request Format:**
```
PUT /api/multimedija/1
Content-Type: application/json
```

**Request Body:**
```json
{
  "naziv": "Updated Title",
  "autor": "New Author",
  "javno": true
}
```

**Success Response:**
```json
{
  "status": "uspjeh",
  "poruka": "Multimedija uspješno ažurirana"
}
```
Status: 200 OK

## Testing Instructions

### Using REST Client Extension

The `test.http` file in your project contains test cases for the multimedia API. Here's how to use them:

1. **Install REST Client Extension** (if not already installed)
   - Go to VS Code Extensions
   - Search for "REST Client"
   - Install by Humao

2. **Open test.http file**
   - The file contains organized test cases
   - Tests are separated by `###` comments

3. **Authentication Tests** (required first)
   ```
   POST http://localhost:12222/register
   POST http://localhost:12222/login
   ```

4. **Upload Tests**
   - Replace `<binary image data>` with actual file content
   - Click "Send Request" above each test

### Manual Testing with cURL

#### 1. Login first
```bash
curl -X POST http://localhost:12222/login \
  -H "Content-Type: application/json" \
  -d '{"korisnickoIme":"testuser1","lozinka":"password123"}' \
  -c cookies.txt
```

#### 2. Upload an image
```bash
curl -X POST http://localhost:12222/api/multimedija \
  -F "datoteka=@/path/to/image.jpg" \
  -F "naziv=My Image" \
  -F "kolekcijaId=1" \
  -F "autor=Test Author" \
  -F "javno=true" \
  -b cookies.txt
```

#### 3. Get multimedia by ID
```bash
curl http://localhost:12222/api/multimedija/1 \
  -b cookies.txt
```

#### 4. Update metadata
```bash
curl -X PUT http://localhost:12222/api/multimedija/1 \
  -H "Content-Type: application/json" \
  -d '{"naziv":"Updated Title","javno":false}' \
  -b cookies.txt
```

#### 5. Delete multimedia
```bash
curl -X DELETE http://localhost:12222/api/multimedija/1 \
  -b cookies.txt
```

## Test Scenarios

### Scenario 1: Successful Upload
1. Register a new user
2. Login with that user
3. Create a collection
4. Upload a valid image (< 500 KB, JPEG/PNG/GIF/WebP)
5. Verify: Response 201 with status "uspjeh"

### Scenario 2: File Size Validation
1. Login as a user
2. Attempt to upload image > 500 KB
3. Verify: Response 400 with appropriate error message
4. Attempt to upload video > 1 MB
5. Verify: Response 400 with appropriate error message

### Scenario 3: File Type Validation
1. Login as a user
2. Attempt to upload .txt, .pdf, or other unsupported file
3. Verify: Response 400 - "Nepodržan tip datoteke"

### Scenario 4: Permission Control - Delete
1. User A creates a collection and uploads multimedia
2. User B attempts to delete User A's multimedia
3. Verify: Response 403 - "Nemate dozvolu da izbrišete ovu multimediju"
4. Admin attempts to delete same multimedia
5. Verify: Response 201 - successful deletion

### Scenario 5: Permission Control - GET
1. User A makes multimedia private (javno=false)
2. Guest/User B attempts to access
3. Verify: Response 403 - "Nemate dozvolu pristupa"
4. User A attempts to access own multimedia
5. Verify: Response 200 with metadata

### Scenario 6: Session Validation
1. Logout or clear session
2. Attempt POST without session
3. Verify: Response 401 - "Morate biti prijavljeni..."

### Scenario 7: Invalid ID
1. Attempt GET/PUT/DELETE with non-numeric or non-existent ID
2. Verify: Response 404 - "Multimedija ne postoji"

## File Storage

Files are stored in: `podaci/multimedija/`

**File naming convention:**
- Pattern: `{original_name}_{timestamp}{extension}`
- Example: `test_image_1674829200000.jpg`
- Original filename is sanitized to prevent security issues

**Database storage:**
- Only the file path is stored in the database
- Metadata: name, type, collection, author, date, public status

## Validation Rules

### File Type Validation
**Images:** image/jpeg, image/png, image/gif, image/webp
**Videos:** video/mp4, video/webm, video/quicktime

### File Size Limits
- Images: 500 KB maximum
- Videos: 1 MB maximum

### Field Validation
- `naziv`: Required, max 255 characters
- `kolekcijaId`: Required, must be valid collection ID
- `autor`: Optional, max 255 characters
- Unsafe characters are removed from filenames

## Error Responses

All errors follow this JSON format:
```json
{
  "greska": "Error message in Croatian"
}
```

### Common Error Messages
- "Morate biti prijavljeni..." - User not authenticated
- "Nemate dozvolu..." - User lacks permission
- "Multimedija ne postoji" - Resource not found
- "Nepodržan tip datoteke" - Invalid file type
- "Datoteka je prevelika" - File exceeds size limit
- "Neispravan ID multimedije" - Invalid ID format

## Security Features

✅ **Session validation** - All endpoints check active session
✅ **Permission checking** - Owner/Admin/Moderator validation
✅ **File type validation** - MIME type and extension checking
✅ **File size limits** - Enforced at multiple levels
✅ **Safe filename handling** - Characters sanitized to prevent path traversal
✅ **Proper HTTP status codes** - 401, 403, 404, 400, 500 appropriately used
✅ **Async/await pattern** - Non-blocking file operations
✅ **File cleanup** - Temporary files deleted on error
✅ **Database transactions** - Atomic operations

## Troubleshooting

### "Nepodržan tip datoteke" error
- Verify file MIME type matches allowed types
- Check file extension matches MIME type
- Try with JPEG/PNG image or MP4 video

### "Datoteka je prevelika" error
- Check file size: image ≤ 500 KB, video ≤ 1 MB
- Compress the file before uploading

### "Morate biti prijavljeni" error
- Ensure you're logged in
- Session may have expired - login again
- Check cookies are being sent with request

### File not found after upload
- Check `podaci/multimedija/` directory exists
- Verify file system permissions
- Check server logs for errors

### 403 Permission Denied
- Ensure user owns the collection
- If not owner, verify user is admin or moderator
- Check multimedia is not private (for GET requests)

## Next Steps

1. **Test with REST Client:** Use the `test.http` file for quick testing
2. **Verify file storage:** Check `podaci/multimedija/` directory after uploads
3. **Monitor permissions:** Test with different user roles
4. **Stress test:** Upload multiple files and verify database integrity
5. **Frontend integration:** Connect your frontend to these endpoints
