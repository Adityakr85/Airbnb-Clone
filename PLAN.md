# Next Steps Plan

## Backend
1. **Test the updated endpoints**:
   - Verify that guests can view their own reservation details (frontend BookingDetails page) by passing clerk_id.
   - Verify that hosts can view reservation details for their properties (same endpoint) by passing clerk_id.
   - Verify that administrators can access `/admin/properties` (via AdminController) and see all properties.
   - Verify that hosts can only update their own properties (PropertyController@update).
   - Verify that hosts can upload images when creating/updating property (via HostContext addProperty/updateProperty using FormData).
   - Verify that the destinations endpoint returns distinct locations from properties.

2. **Authentication and Authorization**:
   - Ensure that the clerk_id is being passed correctly in requests (from frontend) for all endpoints that require it.
   - Consider adding middleware for role-based access control (admin/host) to keep controllers cleaner.

3. **Error Handling**:
   - Review error responses to ensure they are consistent and informative.

## Frontend
1. **Host Property Form**:
   - Ensure that the host property creation/editing form uses the destinations dropdown and allows selecting existing or entering new destination.
   - Ensure that the form sends images as multipart/form-data (already updated in HostContext).

2. **Booking Details Page**:
   - Ensure that the BookingDetails component now fetches the reservation details with the clerk_id from Clerk.
   - Test that guests can see their own bookings and that hosts can see bookings for their properties (if applicable).

3. **Host Dashboard**:
   - Ensure that the host can edit their property listings and that the update requests are sent to the correct endpoint with clerk_id.

4. **Admin Panel**:
   - If there is an admin panel, ensure it fetches properties from the `/admin/properties` endpoint and displays them correctly.
   - Ensure admin/reservations shows reservation details with property and guest information.

## Testing
1. Write unit tests for the controller methods (especially the authorization logic).
2. Write feature tests to simulate admin, host, and guest interactions.

## Documentation
1. Update API documentation (if any) to reflect the endpoints and their security requirements.

## Immediate Tasks (from recent changes)
- [x] Updated ReservationController@show to allow both guest and host to view reservation details.
- [x] Updated frontend api/trips.js to accept clerk_id for fetchReservationDetails.
- [x] Updated frontend BookingDetails.jsx to use Clerk's useUser hook and pass clerk_id.
- [x] Updated HostContext to handle image uploads via FormData.
- [x] Added destinations endpoint in PropertyController and route.
- [x] Updated HostContext to fetch destinations.
- [ ] Test the BookingDetails page to ensure it no longer shows "Booking Not Found".
- [ ] Test the host's ability to view reservation details for their properties.
- [ ] Test the host's ability to create and update properties with images.
- [ ] Test the admin's ability to view all properties.
- [ ] Test the admin's ability to view all reservations.
- [ ] Implement UI in host property form to use destinations dropdown.