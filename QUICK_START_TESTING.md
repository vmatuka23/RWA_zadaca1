# Quick Start - Multimedia API Testing with REST Client

## Prerequisites

1. REST Client extension installed in VS Code
2. Server running on port 12222
3. Database initialized

## Quick Test Workflow

### Step 1: Open test.http

- Open `test.http` file in your project
- You'll see various test requests marked with `###`

### Step 2: Run Authentication Tests First

Scroll to the top of `test.http` and run these in order:

1. **Register a user** - Click "Send Request" on the register block
2. **Login** - Click "Send Request" on the login block
   - This establishes a session for subsequent requests
   - REST Client saves cookies automatically

### Step 3: Create a Collection (if needed)

Run the "Create a collection first" request to have a valid collection ID for uploads.

### Step 4: Test Multimedia Upload

Navigate to the section marked "### Test 2: Upload image - valid"

Before sending, you need to add a real image file. Two options:

**Option A: Use VS Code REST Client's file reference**
Replace the `<binary image data - replace with actual image file>` line with:

```
< ./path/to/your/test-image.jpg
```

Example:

```
POST http://localhost:12222/api/multimedija
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary

------WebKitFormBoundary
Content-Disposition: form-data; name="datoteka"; filename="test_image.jpg"
Content-Type: image/jpeg

< ./test-image.jpg
------WebKitFormBoundary
Content-Disposition: form-data; name="naziv"

Moja Testna Slika
------WebKitFormBoundary--
```

**Option B: Use cURL from terminal** (easier)

```bash
cd c:\Users\Vigo\Documents\RWA\zadaca1
curl -X POST http://localhost:12222/api/multimedija \
  -F "datoteka=@./test-image.jpg" \
  -F "naziv=Moja Testna Slika" \
  -F "kolekcijaId=1" \
  -F "javno=true" \
  -b cookies.txt -c cookies.txt
```

### Step 5: Test GET Multimedia

After successful upload (note the ID from response):

```http
GET http://localhost:12222/api/multimedija/1
```

### Step 6: Test UPDATE Metadata

```http
PUT http://localhost:12222/api/multimedija/1
Content-Type: application/json

{
  "naziv": "Updated Title",
  "javno": false
}
```

### Step 7: Test DELETE

```http
DELETE http://localhost:12222/api/multimedija/1
```

## Using REST Client Features

### Tip 1: Save Session Cookies

REST Client automatically saves cookies, but you can verify in `.vscode/settings.json`:

```json
"rest-client.certificateFilePath": true
```

### Tip 2: Environment Variables

Create `.env` file or use:

```
@baseUrl = http://localhost:12222
@collectionId = 1

GET @baseUrl/api/multimedija/@collectionId
```

### Tip 3: View Response

After running a test:

- Response appears on the right side panel
- View formatted JSON
- View headers
- View cookies

### Tip 4: Copy as cURL

- Right-click any request
- "Copy As cURL"
- Paste into terminal for batch testing

## Common REST Client Shortcuts

| Action         | Shortcut                     |
| -------------- | ---------------------------- |
| Send Request   | Ctrl+Alt+R (or button above) |
| Clear Response | Ctrl+Alt+C                   |
| Show Response  | Ctrl+Alt+L                   |
| Generate Code  | Ctrl+Alt+Shift+R             |

## Testing Checklist

- [ ] Can register new user
- [ ] Can login (session established)
- [ ] Can upload valid image (< 500 KB)
- [ ] Can upload valid video (< 1 MB)
- [ ] Upload fails for invalid file type ✓
- [ ] Upload fails for oversized file ✓
- [ ] Can retrieve multimedia by ID ✓
- [ ] Can update metadata ✓
- [ ] Can delete multimedia ✓
- [ ] Permissions work (403 for unauthorized) ✓
- [ ] Session validation works (401 when not logged in) ✓
- [ ] Error messages are helpful ✓

## Expected Status Codes

| Endpoint                    | Success | Auth Error | Permission  | Not Found |
| --------------------------- | ------- | ---------- | ----------- | --------- |
| POST /api/multimedija       | 201     | 401        | 403 (guest) | N/A       |
| GET /api/multimedija/:id    | 200     | N/A        | 403         | 404       |
| PUT /api/multimedija/:id    | 200     | 401        | 403         | 404       |
| DELETE /api/multimedija/:id | 201     | 401        | 403         | 404       |

## Response Examples

### Successful Upload (201)

```json
{
  "status": "uspjeh",
  "poruka": "Multimedija uspješno učitana",
  "id": 1
}
```

### Successful GET (200)

```json
{
  "id": 1,
  "naziv": "Moja Testna Slika",
  "tip": "slika",
  "putanja": "podaci/multimedija/moja_testna_slika_1674829200000.jpg",
  "kolekcijaId": 1,
  "javno": 1,
  "datumDodavanja": "2025-01-27T10:30:00.000Z",
  "autor": "Test Autor"
}
```

### Unauthorized (401)

```json
{
  "greska": "Morate biti prijavljeni da kreirate multimediju"
}
```

### Forbidden (403)

```json
{
  "greska": "Nemate dozvolu da izbrišete ovu multimediju"
}
```

### Not Found (404)

```json
{
  "greska": "Multimedija ne postoji"
}
```

### Bad Request (400)

```json
{
  "greska": "Nepodržan tip datoteke. Dozvoljeni su: JPEG, PNG, GIF, WebP (slike) ili MP4, WebM, MOV (video)"
}
```

## Troubleshooting Tips

**Session Lost?**

- Login again
- Check REST Client has cookies enabled
- Verify server session hasn't expired

**File Upload Fails?**

- Check file is < 500 KB (images) or < 1 MB (video)
- Verify file is actual image/video (not just renamed)
- Check kolekcijaId is valid and accessible

**Permission Denied?**

- Verify you own the collection
- Check multimedia isn't marked private (if you're not owner)
- Try with admin account

**Database Errors?**

- Check database file exists: `podaci/RWA2025vmatuka23.sqlite`
- Verify `podaci/multimedija/` directory exists
- Check server logs for SQL errors

## What's Tested

✅ All three main endpoints (POST, GET, DELETE)
✅ File type validation (image/video)
✅ File size limits (500 KB / 1 MB)
✅ Session validation (401)
✅ Permission validation (403)
✅ Not found errors (404)
✅ Missing fields validation (400)
✅ Invalid ID format (400)
✅ Metadata update (PUT)
✅ Error messages in Croatian

## File Storage Location

After successful upload, files are stored in:

```
podaci/multimedija/
```

You can verify uploads by checking this directory!
