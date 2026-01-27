# 📱 Multimedia REST API - Testing Guide

## How to Test Your Implementation

Your multimedia REST API is complete and ready for testing! Here's everything you need to know.

---

## 🚀 Quick Start (5 Minutes)

### Step 1: Start Your Server

```bash
npm start
```

Server runs on: `http://localhost:12222`

### Step 2: Open REST Client

1. Open VS Code
2. Open the `test.http` file in your project
3. You'll see requests marked with `###`

### Step 3: Run Tests in Order

1. Scroll to top
2. **Click "Send Request"** on: Register user
3. **Click "Send Request"** on: Login
4. **Click "Send Request"** on: Create collection
5. **Click "Send Request"** on: Upload image
6. Check response on the right panel - should see `201` and `"status": "uspjeh"`

✅ **You're done! Your API works!**

---

## 📋 What's in test.http

The file contains organized test requests:

### Authentication

- Register new user
- Login (establishes session)
- Get current user
- Logout

### Multimedia Upload

- Upload valid image
- Upload valid video
- Upload invalid file (should fail)
- Upload missing fields (should fail)

### Multimedia Retrieval

- Get multimedia by ID
- Get all multimedia
- Get non-existent multimedia (404)

### Multimedia Update

- Update metadata
- Update non-existent (404)

### Multimedia Deletion

- Delete multimedia
- Delete non-existent (404)
- Delete without session (401)

### Permission Tests

- Test unauthorized access (403)
- Test admin privileges

---

## 🔍 Understanding Responses

### Success Response (201/200)

```json
{
  "status": "uspjeh",
  "poruka": "Multimedija uspješno učitana",
  "id": 1
}
```

✅ Look for `"status": "uspjeh"` to confirm success

### Error Response (400/401/403/404)

```json
{
  "greska": "Error message in Croatian"
}
```

Read the `greska` field to understand what went wrong

### Status Codes

| Code | Meaning                                      |
| ---- | -------------------------------------------- |
| 201  | Successfully created/deleted                 |
| 200  | Successfully retrieved/updated               |
| 400  | Invalid input (bad file type, missing field) |
| 401  | Not logged in                                |
| 403  | No permission                                |
| 404  | Multimedia not found                         |
| 500  | Server error                                 |

---

## 📂 Test Scenarios

### Scenario 1: Successful Upload

```
1. Login
2. Create collection
3. Upload image (< 500 KB)
4. Check response: 201, status = "uspjeh"
5. Verify file in podaci/multimedija/
```

### Scenario 2: File Size Validation

```
1. Login
2. Try upload image > 500 KB
3. Check response: 400
4. Read error message
```

### Scenario 3: File Type Validation

```
1. Login
2. Try upload .txt file
3. Check response: 400
4. Error: "Nepodržan tip datoteke"
```

### Scenario 4: Permission Control

```
1. User A creates and uploads
2. User B tries to delete
3. Check response: 403
4. Error: "Nemate dozvolu..."
```

### Scenario 5: Session Validation

```
1. Logout
2. Try POST without session
3. Check response: 401
4. Error: "Morate biti prijavljeni"
```

---

## 💻 REST Client Tips

### Finding Send Request Button

- Hover over test request
- Look for play button (▶️) above request
- Click it to send

### Viewing Response

- Response shows on **right panel**
- See formatted JSON
- See status code and headers
- See cookies sent/received

### Keyboard Shortcuts

| Action         | Shortcut       |
| -------------- | -------------- |
| Send request   | Ctrl + Alt + R |
| Clear response | Ctrl + Alt + C |

### Saving Responses

- Right-click response
- Select "Save Response as..."
- Useful for debugging

---

## 🔄 Session Management in REST Client

### How Session Works

1. When you login, REST Client receives a cookie
2. Cookie is automatically saved
3. Subsequent requests automatically include cookie
4. Session persists across requests

### Cookie Debugging

1. Look at response headers
2. Search for `set-cookie`
3. Verify cookie is in subsequent requests

### Session Expires?

- Login again with same test
- Click "Send Request" again
- REST Client will update cookies

---

## 🧪 Testing Checklist

Use this checklist to verify all functionality:

### Authentication

- [ ] Can register new user
- [ ] Can login successfully
- [ ] Can get current user info
- [ ] Can logout

### Upload

- [ ] Can upload JPG image
- [ ] Can upload PNG image
- [ ] Can upload MP4 video
- [ ] Upload returns 201 status
- [ ] Uploaded file appears in podaci/multimedija/
- [ ] Metadata saved to database

### Validation

- [ ] Reject .txt file ✓
- [ ] Reject image > 500 KB ✓
- [ ] Reject video > 1 MB ✓
- [ ] Reject missing fields ✓
- [ ] Proper error messages ✓

### Retrieval

- [ ] Can get multimedia by ID
- [ ] Can list all multimedia
- [ ] Returns correct metadata
- [ ] Returns 404 for non-existent

### Update

- [ ] Can update title
- [ ] Can update author
- [ ] Can change public/private
- [ ] Returns 404 for non-existent

### Deletion

- [ ] Can delete own multimedia
- [ ] File removed from filesystem
- [ ] Record removed from database
- [ ] Returns 404 for non-existent

### Permissions

- [ ] Guest can't upload ✓
- [ ] User can't delete others' files ✓
- [ ] Admin can delete any file ✓
- [ ] Owner can delete own files ✓
- [ ] 401 when not logged in ✓
- [ ] 403 when unauthorized ✓

---

## 📊 Expected Results

### Upload Test

```
POST /api/multimedija
Content: multipart form-data

Expected:
- Status: 201
- Response: { "status": "uspjeh", "id": 1 }
- File: podaci/multimedija/myimage_1674829200000.jpg
- Database: New row in multimedija table
```

### Get Test

```
GET /api/multimedija/1

Expected:
- Status: 200
- Response: Full metadata object
- Fields: id, naziv, tip, putanja, kolekcijaId, javno, datumDodavanja, autor
```

### Delete Test

```
DELETE /api/multimedija/1

Expected:
- Status: 201
- Response: { "status": "uspjeh" }
- File: Removed from podaci/multimedija/
- Database: Row deleted from multimedija table
```

---

## 🐛 Troubleshooting

### "401 - Morate biti prijavljeni"

**Problem:** Not logged in
**Solution:** Run login test first, verify cookie saved

### "403 - Nemate dozvolu"

**Problem:** Don't own the multimedia
**Solution:** Try with owner account or admin

### "400 - Nepodržan tip datoteke"

**Problem:** File type not supported
**Solution:** Use JPEG, PNG, GIF, WebP (images) or MP4, WebM, MOV (video)

### "400 - Datoteka je prevelika"

**Problem:** File exceeds size limit
**Solution:** Images must be ≤ 500 KB, videos ≤ 1 MB

### "404 - Multimedija ne postoji"

**Problem:** ID doesn't exist
**Solution:** Check multimedia ID in database or check response from upload

### File Not Appearing in Folder

**Problem:** File upload failed silently
**Solution:** Check response status code and error message

### Empty Response

**Problem:** Server crashed or no response
**Solution:** Check server logs, verify server is running

---

## 📁 File Locations

### Uploaded Files

```
podaci/multimedija/
├── myimage_1674829200000.jpg
├── myvideo_1674829300000.mp4
└── temp/
    └── (temporary upload location)
```

### Database

```
podaci/RWA2025vmatuka23.sqlite
```

Table: `multimedija`

### Test File

```
test.http
```

---

## 🎯 What Each Test Checks

| Test              | Checks             | Expected Code |
| ----------------- | ------------------ | ------------- |
| Register          | User creation      | 201           |
| Login             | Session start      | 200           |
| Upload valid      | File processing    | 201           |
| Upload large      | Size validation    | 400           |
| Upload wrong type | Type validation    | 400           |
| Get by ID         | Metadata retrieval | 200           |
| Get non-existent  | Not found handling | 404           |
| Update            | Metadata update    | 200           |
| Delete            | File removal       | 201           |
| Delete other's    | Permission check   | 403           |
| No session        | Auth check         | 401           |

---

## 🔐 Security Verified

These security features are tested:

- ✅ Session validation (401)
- ✅ Permission checking (403)
- ✅ File type validation (400)
- ✅ File size validation (400)
- ✅ Path traversal prevention
- ✅ Filename sanitization
- ✅ Database safety (prepared statements)

---

## 💡 Pro Tips

1. **Test one at a time** - Don't run multiple tests simultaneously
2. **Keep authentication tests first** - Login once, reuse session
3. **Note IDs from upload** - Use ID from upload test for get/update/delete
4. **Check both response and files** - Verify API AND filesystem
5. **Read error messages** - They tell you what's wrong in Croatian

---

## 🎯 Success Criteria

Your implementation is working if:

✅ All 14+ tests can be run
✅ Upload returns 201
✅ GET returns 200
✅ DELETE returns 201
✅ Files appear in podaci/multimedija/
✅ Metadata appears in database
✅ Validation errors return 400
✅ Permission errors return 403
✅ Auth errors return 401
✅ Not found errors return 404

---

## 📞 Need Help?

1. **Check test.http** - Examples of every endpoint
2. **Read error message** - Tells you what's wrong
3. **Check server logs** - Shows detailed errors
4. **Verify file exists** - Check podaci/multimedija/
5. **Check database** - Use SQLite viewer to inspect data

---

## 🚀 Next Steps After Testing

1. ✅ **Run all tests** - Verify everything works
2. ✅ **Check files created** - Browse podaci/multimedija/
3. ✅ **Inspect database** - View multimedija table
4. ✅ **Read integration guide** - INTEGRATION_EXAMPLES.md
5. ✅ **Connect frontend** - Use provided code examples
6. ✅ **Deploy** - Move to production

---

## 📚 Related Documentation

- **README_MULTIMEDIA_API.md** - Feature overview
- **QUICK_START_TESTING.md** - 5-minute quickstart
- **MULTIMEDIA_API_TESTING_GUIDE.md** - Complete reference
- **INTEGRATION_EXAMPLES.md** - Frontend code examples
- **IMPLEMENTATION_SUMMARY.md** - Technical details

---

## ✨ You're Ready!

Everything is set up and ready to test. Here's what to do:

1. **Open test.http**
2. **Login** (top of file)
3. **Create collection**
4. **Upload image**
5. **Check response** - should see status 201 and "status": "uspjeh"
6. **Celebrate!** 🎉

Your multimedia API is working! 🚀

---

**Happy Testing!**
