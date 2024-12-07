<a name="readme-top"></a>



<div align="center">

<img src="logo.png" alt="logo" width="140" height="auto" style="border-radius:50%"   />
<br/>
<h3><b>AI CROSS POST BLOG APP WITH COPILOT FEATURE</b>

</div>

# ✅ TABLE OF CONTENTS
- [📖 About the Project](#about-project)
  - [⚒️ Build With](#built-with)
    - [ Tech Stack](#tech-stack)
    - [ Key Features](#key-features)
  - [🚀 Live Demo](#live-demo)
 - [💻 Getting Started](#getting-started)
   - [Setup](#setup)
   -  [Prerequisites](#prerequisites)
   - [Install](#install)
   - [Usage](#usage)
   - [Run tests](#run-tests)
   - [Deployment](#deployment)
- [👥 Authors](#authors)
- [🕹️ Future Features](#future-features)
- [🤝 Contributing](#contributing)
- [⭐ Show your Support](#support)
- [👏 Acknowledgements ](#ackknowledgements)
- [❓ FAQ ](#faq)
- [📃 License](#license)

# 📖 [AI CROSS POST BLOG APP WITH COPILOT FEATURE] <a name="about-project"></a>

**[AI Cross Post Blog APP With  Copilot Feature]** The AI Cross Post Blog APP revolutionizes the blogging experience by merging cutting-edge artificial intelligence with streamlined content management. At its core, the platform serves as a centralized hub where content creators can craft their articles using AI-assisted tools while eliminating the traditional hassle of manually posting to multiple platforms.
The application's intelligent integration with Hashnode, Dev.to, and Medium transforms what would typically be a time-consuming process of logging into multiple accounts, reformatting content, and managing separate drafts into a seamless one-click operation. Writers can compose their content in our feature-rich editor while our platform handles the intricate details of formatting and cross-platform compatibility.

The application's AI integration goes beyond simple cross-posting capabilities. It understands the nuances of each platform's formatting requirements, audience preferences, and content guidelines. This means that when a writer creates a post, the system can automatically optimize the content format, tags, and presentation for each target platform, ensuring maximum engagement across all channels.

## ⚒️ Build With <a name="built-with"></a>

<p>
This Projects was built using:
MERN STACK
</p>

### Tech Stack <a name="tech-stack"></a>

<li> React </li>
<li> NODE.JS </li>
<li> EXPRESS </li>
<li> MySql </li>
<li> Docker </li>
<li> Docker Compose</li>



### Key Features <a name="key-features"></a>

<p align="right"><a href="#readme-top">Back to top</a></p>

## 💻 Getting Started <a name="getting-started"></a>


To get a local copy up and running follow these steps:

### Prerequisites 

To run this project you need the following tools:

- [VS Code]
- [Git and GitHub]
- [BashScript ]
- [ Docker ](https://www.docker.com/)
- [ Docker Compose ](https://www.docker.com/)    
- [ Swagger ](https://swagger.io/specification/)
- [ Make ](https://www.gnu.org/software/make/manual/make.html)
- [ OpenAi Platform Api Keys](https://platform.openai.com/)
- [Medium Api](https://github.com/Medium/medium-api-docs)
- [ HashNode Api](https://apidocs.hashnode.com/)
- [ DevTo Api](https://developers.forem.com/api)
- [ OpenSSL ](https://www.openssl.org/)
### Setup

Clone this respository  to your desired folder:

```sh
cd Ai-Cross-Post-Loading-Blog-App
git clone https://github.com/alyconr/Ai-Cross-Post-Loading-Blog-App.git
```
### Install

Install This project using MAKE:

### Install dependencies

Backend:
```sh
    make install-backend
```

Frontend:
```sh
    make install-frontend
```
Database:

```sh
    make install-database
```

### Usage 

To run the project, execute the following command using MAKE:

 Execute the Backend

```sh
    make dev-backend
```
 Execute the Frontend

```sh
    make dev-frontend
```

### Run Test

I configure some unit tests for the write component, To run this test, run the following command or endpoint:

```sh
  make test-frontend
```


### Deployment

Deploy using Docker Compose:

Development: For the development environment, Only Frontend and Backend were deployed. Database is used localy.

```sh
  make docker-dev-up
```
To stop the containers, run the following command:

```sh
  make docker-dev-down
```


Production:

```sh
  make docker-prod-up
```
To stop the containers, run the following command:

```sh
  make docker-prod-down
```

Nginx Certificates:

```sh
  make generate-certificates
```

<p align="right"><a href="#readme-top">Back to top</a></p>

### Database

The project uses MySql as a database, you can find the database configuration in the .env file.

- Entity Relationship Diagram:

<div align="center">

<img src="Entity RelationShip Diagram.png" alt="logo" width="400" height="auto"   />

</div>


## 👥 Authors <a name="authors"></a>

Jeysson Contreras

🧑🏻‍💻 **Author 1**

 - GitHub: [@alyconr](https://github.com/alyconr)
 - LinkedIn: [LinkedIn](https://www.linkedin.com/in/jeysson-aly-contreras)


## 🕹️ Future Features<a name="future-features"></a>

- [ ] **[Cross-Platform Publishing]**
      Writers can compose their content once and publish or draft simultaneously across multiple platforms, streamlining their content distribution workflow. The platform supports direct integration with:

    - Hashnode
    - Dev.to
    - Medium
    
- [ ] **[AI-Powered Writing Assistant]**
      Our platform features a sophisticated rich text editor enhanced with an AI copilot, providing real-time writing assistance and suggestions. This intelligent writing companion helps users craft better content by offering contextual recommendations and improvements.

- [ ] **[Automated Blog Generation]**
      The platform includes an advanced AI feature that leverages GPT-4 to generate comprehensive blog posts. Users can provide:

- Maximum up to 10 reference URLs
- A topic description
- The system automatically generates a well-structured    blog post complete with:
- Table of contents
- Relevant code examples
- Technical explanations
- Answering user questions

- [ ] **[Authentication and Authorization]**
      
      The platform employs a secure authentication and authorization system that ensures:

    - User registration
    - User login
    - User profile management
    - User authentication
    - User authorization
    - Recover password

- [ ] **[Community Engagement]**
      The platform fosters a vibrant community through various social features:

    - User profiles
    - Follow system
    - Clap system 
    - Comment system for discussions
    - Bookmark system
    - Post sharing system
    - Social media share blog links

- [ ] **[Swagger Documentation]**
      
     The platform includes a Swagger documentation for easy API exploration and integration.

    ```sh
      http://localhost:9000/api-docs
    ```
- [ ] **[OpenAI Integration]**

      The platform integrates with OpenAI's GPT-4 API to provide real-time writing assistance and suggestions.
    
    

## 🤝 Contributing <a name="contributing"></a>


Contributions, issues, and  feature requests are welcome! [Contributing](./CONTRIBUTING.md)

Feel free tp check the [issues page](https://github.com/alyconr/Ai-Cross-Post-Loading-Blog-App.git/issues)


## ⭐ Show your Support

Wrrite a message to encourage readers to support your project

If you like this project please give one start

## 👏 Acknowledgements <a name="acknowledgements"></a>

This project was  inspired by [Hashnode](https://hashnode.com/) , [Dev.to](https://dev.to/) and [Medium](https://medium.com/)

## 📃 License <a name="license"></a>

This Project is  GNU GENERAL PUBLIC LICENSE [GNU](./LICENSE) 

<p align="right"><a href="#readme-top">Back to top</a></p>



