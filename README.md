# BuildMoments

***List of Screens:***

1. Sign In Screen
2. Sign Up Screen
3. Add New Moments/images
4. List Moments/images
5. Update Moment/images
6. Delete Moment /images
7. Logout Options

***The workflow of the Solution:***

1. Users will Sign up first by using Email, Password, Full Name, city.
2. Post Sign up, the user will redirect to the Login screen.
3. Once the user is logged in successfully, will redirect to the Add New Moment screen where
   the user can able to add the below details :
- Image for Specific Moment (Image should be uploaded on AWS S3/local server) (Only
Image Files can be uploaded)
- Comment with a text area of having a limit of 100 characters.
- Tags input field (Where user can able add Tags)
- User id, Timestamp recorded automatically in the backend at the time of insertion of any
   moment.
4. Post adding a new Moment, the user will redirect to the List of Moments screen.
5. Maintain session between login and logout.

***Assumptions:***

2. All form field data should be validated before sending to API.
3. While performing sign-in of users, follow best practices to maintain the session.
4. Code should be easy to understand and maintainable.
5. Push the code on Git repo with **Build Moments**.

***Expected Output:***

2. All the API’s should be working and implemented successfully.
3. Add authorization to database
4. The design should be responsive in all the devices