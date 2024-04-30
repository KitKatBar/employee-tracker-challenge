# Employee Tracker Challenge - Manage Your Team
  
## Description

There's a lot to managing a business.  You have to keep track of all the departments, roles and employees in a company.  On top of that, all of your employees need to have a salary and some employees could be managers or supervisors of others.  Luckily for you, this application was built for that sole reason - to manage all the business aspects in a database all on your local machine!

Developers frequently have to create interfaces that allow non-developers to easily view and interact with information stored in databases. These interfaces are called content management systems (CMS). This application is built using the command-line to manage a company's employee database, using Node.js, Inquirer, and PostgreSQL.
        
## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Credits](#credits)
- [License](#license)
- [How to Contribute](#how-to-contribute)
- [Questions](#questions)

        
## Installation

Please follow these commands for installation.

1. Clone the repo into your local system.

HTTPS:
```
git clone https://github.com/KitKatBar/employee-tracker-challenge.git
```

SSH:
```
git clone git@github.com:KitKatBar/employee-tracker-challenge.git
```

2. Download all the required modules for this application.

```
npm i
```

The above should install all the modules used in this application, but if it doesn't work you can do the installations separately using these commands below (make sure to do ALL of them).

```
npm i inquirer@8.2.4
```

```
npm i pg@8.11.5
```

```
npm i dotenv
```

## Usage

This project performs CRUD operations that interact with an employee database in PostgreSQL.  There are a variety of operations available for querying the department, role and employee tables.  I have provided a walkthrough video demonstrating how to use this program.  Click on [this link](https://drive.google.com/file/d/1-fZUvClWdOgIPy5nTWCOsMQ_ev2OUu_X/view) to access the video.
        
## Credits

Dotenv NPM Package: https://www.npmjs.com/package/dotenv

PostgreSQL Reference: https://coding-boot-camp.github.io/full-stack/postgresql/postgresql-reference-guide

Our instructor Drew Hoang for introducing us to PostgreSQL this week and opening up a new world of learning for us by showing us how to start connecting the front-end and back-end.  He provides good metaphors for how to do exercises and also makes speed-run videos that are very insightful for providing information and for reviewing class material.

Our TA Kyle Vance for his continued guidance during class and taking the time to explain new concepts. He continues to provide direction for students and is straight to the point in his explainations.

## License

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
This project was built using the MIT License. Please refer to the LICENSE in the repo for more information.
          
## How to Contribute

You can contribute to this project by helping modularize the code!  I have run into issues trying to separate certain functions.  For example, the menu function must be called on again after the user completes their current query, but putting it in a separate file causes them to have circular dependencies.

## Questions

This project was created by KitKatBar.
    
Click on [this link](https://github.com/KitKatBar) to see more of my other works!

Have additional questions about this project?  You can reach out to me with any inquiries at: katriel_chiu@msn.com