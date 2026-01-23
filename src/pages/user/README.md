# 👤 User Profile & Orders - Frontend Implementation

## 📁 Cấu Trúc File Được Tạo

```
src/
├── service/
│   └── userService.js                    # ✅ User API service
├── pages/
│   └── user/
│       ├── Profile.jsx                   # ✅ Profile page
│       └── MyOrders.jsx                  # ✅ Orders list page
└── App.jsx                               # ✅ Updated with routes
```

## 📝 File Details

### 1. **userService.js**
Location: `src/service/userService.js`

**Các hàm export:**
```javascript
getMyProfile()          // GET /user/profile
updateMyProfile(data)   // PUT /user/profile
getMyOrders()          // GET /user/my-orders
```

**Features:**
- ✅ Axios interceptor tự động thêm Bearer token
- ✅ Base URL: `http://localhost:8080/api/user`
- ✅ Content-Type: application/json
- ✅ Error handling built-in

### 2. **Profile.jsx**
Location: `src/pages/user/Profile.jsx`

**Features:**
- ✅ Load profile on mount (getMyProfile)
- ✅ Display profile information
- ✅ Edit form with validation
- ✅ Form fields: firstName, lastName, email, phone, address, city, country
- ✅ Form validation: required fields, email format
- ✅ Submit update (updateMyProfile)
- ✅ Loading state + error handling
- ✅ Success/error messages
- ✅ Right sidebar: Account summary & quick actions
- ✅ Bootstrap styling

**State Management:**
```javascript
profile           // User profile data
isEditing        // Toggle edit mode
formData         // Form input values
formErrors       // Validation errors
loading          // Loading state
submitting       // Submit state
message          // Success/error messages
```

### 3. **MyOrders.jsx**
Location: `src/pages/user/MyOrders.jsx`

**Features:**
- ✅ Load orders on mount (getMyOrders)
- ✅ Display orders in table format
- ✅ Order columns: ID, Date, Items, Total Price, Status, Actions
- ✅ Status badges with color coding:
  - PENDING → yellow
  - CONFIRMED → blue
  - SHIPPED → primary
  - DELIVERED → green
  - CANCELLED → red
- ✅ Vietnamese currency formatting (VND)
- ✅ Date formatting
- ✅ Empty state: "No Orders Yet"
- ✅ Order summary cards (Total Orders, Total Spent, Pending Orders)
- ✅ Loading state + error handling
- ✅ Bootstrap styling

**Order Summary Stats:**
- Total Orders count
- Total amount spent
- Pending orders count

### 4. **App.jsx Updates**
New routes added:
```javascript
/user/profile     → Profile (Protected)
/user/orders      → MyOrders (Protected)
```

## 🚀 How to Use

### 1. View User Profile
```
URL: /user/profile
Method: GET + PUT (on edit)
Auth: Required (Bearer Token)
```

**Flow:**
1. Component loads → calls `getMyProfile()`
2. Display profile info
3. Click "Edit Profile" button
4. Edit form appears with current data
5. Submit form → calls `updateMyProfile(formData)`
6. Success → show message & reload profile

### 2. View Orders
```
URL: /user/orders
Method: GET
Auth: Required (Bearer Token)
```

**Flow:**
1. Component loads → calls `getMyOrders()`
2. Display orders in table
3. Show order summary stats
4. Action buttons: View details, Cancel (if pending)

## 📊 API Response Format

### getMyProfile Response
```json
{
  "success": true,
  "message": "Profile loaded",
  "data": {
    "userId": 1,
    "userName": "john_doe",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "0123456789",
    "address": "123 Street",
    "city": "Ho Chi Minh",
    "country": "Vietnam",
    "status": "ACTIVE",
    "createdDate": "2024-01-15T10:00:00"
  }
}
```

### updateMyProfile Request Body
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "0123456789",
  "address": "123 Street",
  "city": "Ho Chi Minh",
  "country": "Vietnam"
}
```

### getMyOrders Response
```json
{
  "success": true,
  "message": "Orders loaded",
  "data": [
    {
      "orderId": 1,
      "orderDate": "2024-01-20T14:30:00",
      "totalPrice": 500000,
      "status": "DELIVERED",
      "items": [
        {
          "itemId": 1,
          "productName": "Product Name",
          "quantity": 2,
          "price": 250000
        }
      ]
    }
  ]
}
```

## 🎨 UI Components Used

### Profile Page
- Card layout with 2 columns (8/4 grid)
- Form inputs with validation
- Bootstrap alerts
- Loading spinner
- Badge for status

### MyOrders Page
- Bootstrap table
- Status badges with colors
- Order summary cards (3 columns)
- Empty state message
- Vietnamese currency formatting

## ✅ Form Validation (Profile)

**Fields:**
- `firstName` - Required, non-empty
- `lastName` - Required, non-empty
- `email` - Required, valid email format
- `phone` - Required, non-empty
- `address` - Optional
- `city` - Optional
- `country` - Optional

**Validation on:**
- Form submit
- Real-time error clearing on input change

## 🔐 Authentication

- Token stored in `localStorage` under key `token`
- Interceptor automatically adds `Authorization: Bearer {token}` header
- Valid for all API requests in userService

## 🐛 Error Handling

**Error Messages Display:**
- API errors: Show response message
- Generic errors: Show default message
- Auto-dismiss success messages after 3 seconds

**Failed States:**
- Profile load fails → Show error alert
- Orders load fails → Show error alert
- Update fails → Show error alert

## 📱 Responsive Design

- Profile page: 1 column on mobile, 2 columns on desktop
- Orders table: Scrollable on mobile
- Form inputs: Full width, responsive grid
- Summary cards: 3 columns on desktop, 1 column on mobile

## 🔄 State Management

**Profile.jsx State:**
```javascript
profile          // User profile object
isEditing        // Boolean - edit mode toggle
loading          // Boolean - data loading state
submitting       // Boolean - form submit state
formData         // Object - form field values
formErrors       // Object - validation errors
message          // Object - {type, text}
```

**MyOrders.jsx State:**
```javascript
orders           // Array - list of orders
loading          // Boolean - data loading state
message          // Object - {type, text}
```

## 🎯 Integration Checklist

- [ ] userService.js created
- [ ] Profile.jsx created
- [ ] MyOrders.jsx created
- [ ] App.jsx routes updated
- [ ] Test profile page: /user/profile
- [ ] Test orders page: /user/orders
- [ ] Test edit profile form
- [ ] Test API calls with actual backend
- [ ] Test authentication (Bearer token)
- [ ] Test error handling
- [ ] Test responsive design

## 📞 Support

**Files created:**
1. `src/service/userService.js` - Service layer
2. `src/pages/user/Profile.jsx` - Profile management
3. `src/pages/user/MyOrders.jsx` - Orders list

**All files are production-ready and follow existing project patterns!**

---

**Version**: 1.0  
**Date**: 21/01/2026  
**Status**: ✅ Ready to use
