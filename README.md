<a name="readme-top"></a>



<div align="center">

<img src="logo.png" alt="logo" width="400" height="250"   />
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

**[AI Cross Post Blog APP With  Copilot Feature]** Welcome to AI Cross Post Blog - where we're taking the headache out of multi-platform blogging! Ever wished you could write once and publish everywhere? That's exactly what we've built. Our app combines the power of AI with smart publishing tools to help content creators focus on what they do best: writing great content.
No more jumping between Hashnode, Dev.to, and Medium tabs, or wrestling with different formatting requirements. Just write your article in our editor, hit publish, and we'll take care of the rest. It's that simple! Our AI doesn't just blindly copy-paste your content - it's smart enough to understand what works best on each platform, tweaking your posts to shine wherever they land.
Think of us as your tech-savvy publishing assistant who knows exactly how to make your content look its best, whether it's adapting your tags for Dev.to's community or optimizing your formatting for Medium's readers. We handle all the technical stuff behind the scenes, so you can spend more time creating and less time formatting.
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

For Linux:
```sh
apt-get install make
```

For Windows:
```sh
choco install make
```

For MacOS:
```sh
brew install make
```

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


- [ ] **[Post Format Optimization]**
      
     The platform will optimize the post format to improve readability and engagement.

- [ ] **[Image Optimization]**
      
     The platform will optimize the images to improve performance and quality.

- [ ] **[Search Engine Optimization]**
      
     The platform will optimize the search engine optimization to improve visibility and reach.

- [ ] **[Analytics]**
      
     The platform will add analytics to track user behavior and improve the user experience.

    
    

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



