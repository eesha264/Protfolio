/* Change this file to get your personal Portfolio */

// To change portfolio colors globally go to the  _globalColor.scss file

import emoji from "react-easy-emoji";
import splashAnimation from "./assets/lottie/splashAnimation"; // Rename to your file name for custom animation

// Splash Screen

const splashScreen = {
  enabled: true, // set false to disable splash screen
  animation: splashAnimation,
  duration: 2000 // Set animation duration as per your animation
};

// Summary And Greeting Section

const illustration = {
  animated: true // Set to false to use static SVG
};

const greeting = {
  username: "Eeshitha Gone",
  title: "Hi all, I'm Eeshitha",
  subTitle: emoji(
    "Final-year Data Science student building AI-powered web applications and scalable full-stack solutions."
  ),
  resumeLink:
    "https://drive.google.com/file/d/1ofFdKF_mqscH8WvXkSObnVvC9kK7Ldlu/view?usp=sharing", // Set to empty to hide the button
  displayGreeting: true // Set false to hide this section, defaults to true
};

// Social Media Links

const socialMediaLinks = {
  github: "https://github.com/eesha264",
  linkedin: "https://www.linkedin.com/in/eesha-gone",
  gmail: "eeshagone45@gmail.com",
  // Instagram, Twitter and Kaggle are also supported in the links!
  // To customize icons and social links, tweak src/components/SocialMedia
  display: true // Set true to display this section, defaults to false
};

// Skills Section

const skillsSection = {
  title: "What I do",
  subTitle: "CRAZY FULL STACK DEVELOPER WHO WANTS TO EXPLORE EVERY TECH STACK",
  skills: [
    emoji("⚡ Build full-stack web apps using React, Node.js, and MongoDB"),
    emoji("⚡ Develop AI-powered features and data-driven applications"),
    emoji("⚡ Create responsive UI with Tailwind CSS and modern frameworks")
  ],

  /* Make Sure to include correct Font Awesome Classname to view your icon
https://fontawesome.com/icons?d=gallery */

  softwareSkills: [
    {
      skillName: "html-5",
      fontAwesomeClassname: "fab fa-html5"
    },
    {
      skillName: "css3",
      fontAwesomeClassname: "fab fa-css3-alt"
    },
  
    {
      skillName: "JavaScript",
      fontAwesomeClassname: "fab fa-js"
    },
    {
      skillName: "reactjs",
      fontAwesomeClassname: "fab fa-react"
    },
    {
      skillName: "nodejs",
      fontAwesomeClassname: "fab fa-node"
    },
    
    
    {
      skillName: "sql-database",
      fontAwesomeClassname: "fas fa-database"
    },
    {
      skillName: "aws",
      fontAwesomeClassname: "fab fa-aws"
    },
    {
      skillName: "firebase",
      fontAwesomeClassname: "fas fa-fire"
    },
    {
      skillName: "python",
      fontAwesomeClassname: "fab fa-python"
    },
    {
      skillName: "docker",
      fontAwesomeClassname: "fab fa-docker"
    }
  ],
  display: true // Set false to hide this section, defaults to true
};

// Education Section

const educationInfo = {
  display: true, // Set false to hide this section, defaults to true
  schools: [
    {
      schoolName: "Sreenidhi institute of Science and Technology",
      logo: require("./assets/images/snist.png"),
      subHeader: "Bacherlors of Science in Data Science",
      duration: "November 2022 - July 2026",
      desc: "CGPA: 7.5",
      
    },
    {
      schoolName: "Page Junior College",
      logo: require("./assets/images/page.png"),
      subHeader: "MPC",
      duration: "May 2020 - March 2022",
      desc: "CGPA: 9.3",
    },
    {
      schoolName: "Pallavi Model School",
      logo: require("./assets/images/pallavi.png"),
      subHeader: "X",
      duration: "May 2019 - March 2020",
      desc: "Percentage: 72.6%",
    }

  ]
};

// Your top 3 proficient stacks/tech experience

const techStack = {
  viewSkillBars: true, //Set it to true to show Proficiency Section
  experience: [
    {
      Stack: "Frontend/Design", //Insert stack or technology you have experience in
      progressPercentage: "90%" //Insert relative proficiency in percentage
    },
    {
      Stack: "Backend",
      progressPercentage: "70%"
    },
    {
      Stack: "Programming",
      progressPercentage: "60%"
    }
  ],
  displayCodersrank: false // Set true to display codersrank badges section need to changes your username in src/containers/skillProgress/skillProgress.js:17:62, defaults to false
};

// Work experience section

const workExperiences = {
  display: true, //Set it to true to show workExperiences Section
  experience: [
    {
      role: "Publicity head",
      company: "Cloud community club, SNIST",
      companylogo: require("./assets/images/c3.jpeg"),
      date: "Nov 2023 – December 2025",
      desc: "Led marketing and outreach for technical events.",
      descBullets: [
       "Organised AI Hack Day with 100+ participants",
       "Managed social media campaigns and student engagement"
      ]
    },
    {
      role: "Tech Lead Intern",
      company: "Vishwam.AI",
      companylogo: require("./assets/images/vishwam.png"),
      date: "May 2025 – July 2025",
      desc: "Led a team of interns and built data processing workflows for structured datasets.",
      descBullets: [
        "Managed task assignments and ensured timely delivery of project milestones",
        "Developed data preprocessing pipelines and evaluation documentation"
      ]
    },
  ]
};

/* Your Open Source Section to View Your Github Pinned Projects
To know how to get github key look at readme.md */

const openSource = {
  showGithubProfile: "true", // Set true or false to show Contact profile using Github, defaults to true
  display: true // Set false to hide this section, defaults to true
};

// Some big projects you have worked on

const bigProjects = {
  title: "Projects",
  subtitle: "SOME STARTUPS AND COMPANIES THAT I HELPED TO CREATE THEIR TECH",
  projects: [
    {
      image: require("./assets/images/zync.png"),
      projectName: "Zync",
      projectDesc: "AI-powered collaboration, messaging, and project management in one place.",
      footerLink: [
        {
          name: "Visit Website",
          url: "https://zync-meet.vercel.app/"
        }
        //  you can add extra buttons here.
      ]
    },
    {
      image: require("./assets/images/packpal.png"),
      projectName: "PackPal",
      projectDesc: "An all-in-one travel planner that combines trip management, live insights, and smart packing in one seamless app.",
      footerLink: [
        {
          name: "Visit Website",
          url: "https://pack-pal-zeta.vercel.app/"
        }
      ]
    }
  ],
  display: true // Set false to hide this section, defaults to true
};

// Achievement Section

const achievementSection = {
  title: emoji("Achievements And Certifications 🏆 "),
  subtitle:
    "Achievements, Certifications, Award Letters and Some Cool Stuff that I have done !",

  achievementsCards: [

    {
      
        title: "Merit Recognition – HACKFUSION 2026",
        subtitle: "Recognised for outstanding performance at an national-level hackathon at JNTUH.",
        image: require("./assets/images/hackfusion.png"),
        
      
     //title: "PWA Web App Developer",
     // subtitle: "Completed Certifcation from SMIT for PWA Web App Development",
      //image: require("./assets/images/pwaLogo.webp"),
      //imageAlt: "PWA Logo",
      footerLink: [
        {name: "Certification", url: ""},
        {
          name: "Final Project",
          url: "https://zync-meet.vercel.app/"
        }
      ]
    }
  ],
  display: true // Set false to hide this section, defaults to true
};

// Resume Section
const resumeSection = {
  title: "Resume",
  subtitle: "Feel free to download my resume",

  display: true // Set false to hide this section, defaults to true
};

const contactInfo = {
  title: emoji("Contact Me ☎️"),
  subtitle:
    "Discuss a project or just want to say hi? My Inbox is open for all.",
  email_address: "eeshagone45@gmail.com"
};

// Twitter Section

const twitterDetails = {
  userName: "twitter", //Replace "twitter" with your twitter username without @
  display: false // Set true to display this section, defaults to false
};

const isHireable = false; // Set false if you are not looking for a job. Also isHireable will be display as Open for opportunities: Yes/No in the GitHub footer

export {
  illustration,
  greeting,
  socialMediaLinks,
  splashScreen,
  skillsSection,
  educationInfo,
  techStack,
  workExperiences,
  openSource,
  bigProjects,
  achievementSection,
  contactInfo,
  twitterDetails,
  isHireable,
  resumeSection
};
