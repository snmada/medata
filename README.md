# General Description
This is a web application that helps medical providers handle administrative tasks.

There are three different user roles available within the application: administrator, scheduler and doctor.

## Technologies Used
- React
- SCSS
- Node.js
- Express
- MySQL

## Registration

The registration page is exclusively designed for administrators to create accounts.

In order to prevent unauthorized individuals from creating accounts, each administrator must create an account using their personal information and the fiscal identification code of the medical institution before using the application. Once the data has been validated successfully, a confirmation email will be sent to the user.

## Login
Users must provide a UID and password to log into their account.

## Administrator Account

After logging in, the administrator is responsible for creating accounts for the schedulers and doctors. When a new user is added, they receive an email containing a link to set a password.

Other functionalities include managing employee information and creating work schedules for each doctor.

## Scheduler Account

The scheduler has the ability to create appointments, cancel them and manage patient data.

## Doctor Account

The doctor has the capability to view their appointments, manage medical records by adding or deleting them and also download medical files in PDF format. 
