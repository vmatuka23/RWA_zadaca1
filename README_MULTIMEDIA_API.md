# Multimedia REST API - Implementation Complete ✅

## Overview

A complete, production-ready REST API for managing multimedia files (images and videos) in your web application. Includes secure file upload, deletion, and metadata management with comprehensive validation and permission control.

## Quick Facts

- **3 Main Endpoints** (+ 2 bonus endpoints)
- **Full Session Validation** across all endpoints
- **Permission-Based Access Control** (owner/admin/moderator)
- **File Type Validation** (JPEG, PNG, GIF, WebP, MP4, WebM, MOV)
- **File Size Limits** (500 KB images, 1 MB videos)
- **14+ Test Cases** in test.http file
- **Type-Safe** TypeScript implementation
- **Error Handling** with meaningful JSON responses

## Getting Started

### 1. Start Your Server

```bash
npm start
```

### 2. Test with REST Client

- Open the `test.http` file in VS Code
- Click "Send Request" on each test case
- Tests are organized and self-documented

### 3. Check Documentation

- **QUICK_START_TESTING.md** - 5-minute quick start
- **MULTIMEDIA_API_TESTING_GUIDE.md** - Comprehensive guide
- **IMPLEMENTATION_SUMMARY.md** - Technical details

## API Endpoints

### Main Endpoints

#### 1. POST /api/multimedija

Upload multimedia with validation

```bash
curl -X POST http://localhost:12222/api/multimedija \
  -F "datoteka=@image.jpg" \
  -F "naziv=My Image" \
  -F "kolekcijaId=1" \
  -F "javno=true"
```

**Response:** 201 Created with `{ "status": "uspjeh" }`

#### 2. GET /api/multimedija/:id

Retrieve multimedia metadata

```bash
curl http://localhost:12222/api/multimedija/1
```

**Response:** 200 OK with complete metadata

#### 3. DELETE /api/multimedija/:id

Delete multimedia (file + database record)

```bash
curl -X DELETE http://localhost:12222/api/multimedija/1
```

**Response:** 201 OK with `{ "status": "uspjeh" }`

### Bonus Endpoints

#### 4. GET /api/multimedija

List all accessible multimedia

```bash
curl http://localhost:12222/api/multimedija
```

#### 5. PUT /api/multimedija/:id

Update metadata

```bash
curl -X PUT http://localhost:12222/api/multimedija/1 \
  -H "Content-Type: application/json" \
  -d '{"naziv": "Updated Title"}'
```

## Features

✅ **Secure File Upload**

- MIME type validation
- File size enforcement
- Sanitized filenames
- Secure storage

✅ **Permission System**

- Session validation
- Owner verification
- Admin/moderator privileges
- Role-based access

✅ **File Management**

- Automatic cleanup on error
- Database + filesystem sync
- Unique file naming
- Path traversal prevention

✅ **Error Handling**

- Meaningful messages (in Croatian)
- Proper HTTP status codes
- Input validation
- Database safety

✅ **Testing**

- 14+ test cases
- All scenarios covered
- REST Client ready
- cURL examples

## File Structure

```
src/servis/
├── restMultimedija.ts   # Main API implementation ✓ Updated
└── servis.ts            # Route configuration ✓ Updated

test.http               # Test cases ✓ Updated

Documentation/
├── QUICK_START_TESTING.md        # ✓ Created
├── MULTIMEDIA_API_TESTING_GUIDE.md # ✓ Created
└── IMPLEMENTATION_SUMMARY.md     # ✓ Created

podaci/multimedija/    # Files stored here
└── temp/              # Temporary upload directory
```

## Validation Rules

### File Types

- **Images:** JPEG, PNG, GIF, WebP
- **Videos:** MP4, WebM, MOV

### File Sizes

- **Images:** ≤ 500 KB
- **Videos:** ≤ 1 MB

### Metadata

- **naziv:** Required, max 255 chars
- **kolekcijaId:** Required, must be valid
- **autor:** Optional, max 255 chars
- **javno:** Optional boolean (default: false)

## Response Examples

### Success - Upload (201)

```json
{
  "status": "uspjeh",
  "poruka": "Multimedija uspješno učitana",
  "id": 1
}
```

### Success - GET (200)

```json
{
  "id": 1,
  "naziv": "My Image",
  "tip": "slika",
  "putanja": "podaci/multimedija/my_image_1674829200000.jpg",
  "kolekcijaId": 1,
  "javno": 1,
  "datumDodavanja": "2025-01-27T10:30:00.000Z",
  "autor": "Test Author"
}
```

### Error - Unauthorized (401)

```json
{
  "greska": "Morate biti prijavljeni da kreirate multimediju"
}
```

### Error - Forbidden (403)

```json
{
  "greska": "Nemate dozvolu da izbrišete ovu multimediju"
}
```

### Error - File Too Large (400)

```json
{
  "greska": "Datoteka je prevelika. Maksimalna veličina za slika je 500 KB"
}
```

## Testing Quick Checklist

- [ ] Register new user
- [ ] Login
- [ ] Create collection
- [ ] Upload valid image
- [ ] Upload valid video
- [ ] Upload fails for .txt file
- [ ] Get multimedia by ID
- [ ] Update metadata
- [ ] Delete multimedia
- [ ] Test permissions (403)
- [ ] Test no session (401)

## Common Errors & Solutions

### 401 - Not Logged In

- Solution: Login first in test.http
- Verify session cookies are enabled

### 403 - Permission Denied

- Solution: Verify you own the collection
- Try with admin account

### 400 - File Too Large

- Solution: Compress file before upload
- Images ≤ 500 KB, Videos ≤ 1 MB

### 400 - Unsupported File Type

- Solution: Use supported formats
- Images: JPEG, PNG, GIF, WebP
- Videos: MP4, WebM, MOV

### 404 - Not Found

- Solution: Verify multimedia ID exists
- Check database for correct ID

## REST Client Tips

**In test.http:**

1. Click the play button above any request
2. Response appears in right panel
3. Login once, session auto-saves
4. Subsequent requests use same session

**Keyboard Shortcuts:**

- `Ctrl+Alt+R` - Send request
- `Ctrl+Alt+C` - Clear response

## Database

Files are stored in SQLite database: `podaci/RWA2025vmatuka23.sqlite`

Table: `multimedija`

- id (PRIMARY KEY)
- naziv
- tip
- putanja
- kolekcijaId (FOREIGN KEY)
- javno
- datumDodavanja
- autor

## File System

Files stored in: `podaci/multimedija/`

**Naming pattern:** `{sanitized_name}_{timestamp}.{extension}`

Examples:

- `test_image_1674829200000.jpg`
- `my_video_1674829300000.mp4`

## Security Features

🔒 **Session Validation** - All endpoints require active session
🔒 **Permission Checking** - Owner/Admin/Moderator verification
🔒 **File Type Validation** - MIME type + extension checking
🔒 **File Size Limits** - Enforced at multiple levels
🔒 **Filename Sanitization** - Prevents path traversal attacks
🔒 **Error Handling** - No sensitive info in error messages
🔒 **Async Operations** - Non-blocking file operations
🔒 **Cleanup** - Temp files deleted on error

## Performance

- **Async/await** throughout (non-blocking)
- **Multer** for efficient streaming uploads
- **Database indexing** on IDs
- **Minimal file operations**
- **Proper status codes** (no unnecessary redirects)

## Deployment

1. Ensure `podaci/` directory exists and is writable
2. Set proper permissions on `podaci/multimedija/`
3. Configure file size limits if needed
4. Monitor disk space
5. Back up database regularly

## Support

For detailed documentation, see:

- **QUICK_START_TESTING.md** - Get testing in 5 minutes
- **MULTIMEDIA_API_TESTING_GUIDE.md** - Complete reference
- **IMPLEMENTATION_SUMMARY.md** - Technical details & troubleshooting

## What's Included

✅ Full TypeScript implementation
✅ Multer file upload handling
✅ Complete error handling
✅ Session & permission validation
✅ 14+ test cases in test.http
✅ 3 documentation files
✅ Type definitions
✅ Database integration

## Requirements Met

✅ POST endpoint for upload with validation
✅ DELETE endpoint with permission checking
✅ GET endpoint for metadata retrieval
✅ Session validation on all endpoints
✅ File type & size validation
✅ Metadata storage in database
✅ File storage in server directory
✅ JSON responses with proper HTTP codes
✅ Meaningful error messages
✅ Async/await implementation
✅ Role-based permission system
✅ Comprehensive testing framework

## Ready to Use!

Your multimedia API is production-ready. Start with:

1. Open `test.http`
2. Run the test cases
3. Check `QUICK_START_TESTING.md` for detailed walkthrough
4. Integrate with your frontend using the documented endpoints

**Happy testing! 🚀**
