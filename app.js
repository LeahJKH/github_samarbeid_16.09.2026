const profileSkills = ["HTML", "CSS", "JavaScript", "React", "Git", "Figma"];
const knownSkills = [
  "HTML",
  "CSS",
  "JavaScript",
  "TypeScript",
  "React",
  "Vue",
  "Node.js",
  "Express",
  "SQL",
  "PostgreSQL",
  "Git",
  "Figma",
  "Tailwind",
  "API",
  "REST",
  "Testing",
];

let selectedJobId = 1;

const jobs = [
  {
    id: 1,
    company: "Nordic Web Studio",
    role: "Junior Frontend Developer",
    status: "Intervju",
    description:
      "Vi ser etter en juniorutvikler med erfaring i HTML, CSS, JavaScript, React, Git og grunnleggende REST API.",
  },
  {
    id: 2,
    company: "Oslo Product Lab",
    role: "Frontend Intern",
    status: "Sendt",
    description:
      "Fordel med React, TypeScript, Tailwind, Figma og interesse for testing av brukergrensesnitt.",
  },
];

const elements = {
  totalApplications: document.querySelector("#totalApplications"),
  interviews: document.querySelector("#interviews"),
  averageMatch: document.querySelector("#averageMatch"),
  jobList: document.querySelector("#jobList"),
  jobForm: document.querySelector("#jobForm"),
  companyInput: document.querySelector("#companyInput"),
  roleInput: document.querySelector("#roleInput"),
  statusInput: document.querySelector("#statusInput"),
  descriptionInput: document.querySelector("#descriptionInput"),
  addSampleButton: document.querySelector("#addSampleButton"),
  matchScore: document.querySelector("#matchScore"),
  profileSkills: document.querySelector("#profileSkills"),
  matchedSkills: document.querySelector("#matchedSkills"),
  missingSkills: document.querySelector("#missingSkills"),
};

function findSkills(description) {
  const text = description.toLowerCase();

  return knownSkills.filter((skill) => text.includes(skill.toLowerCase()));
}

function getJobAnalysis(job) {
  const requiredSkills = findSkills(job.description);
  const matchedSkills = requiredSkills.filter((skill) => profileSkills.includes(skill));
  const missingSkills = requiredSkills.filter((skill) => !profileSkills.includes(skill));
  const score = requiredSkills.length
    ? Math.round((matchedSkills.length / requiredSkills.length) * 100)
    : 0;

  return { requiredSkills, matchedSkills, missingSkills, score };
}

function createTag(skill) {
  const tag = document.createElement("span");
  tag.className = "tag";
  tag.textContent = skill;
  return tag;
}

function renderTags(container, skills) {
  container.innerHTML = "";

  if (!skills.length) {
    const empty = document.createElement("span");
    empty.className = "tag";
    empty.textContent = "Ingen data";
    container.append(empty);
    return;
  }

  skills.forEach((skill) => container.append(createTag(skill)));
}

function renderStats() {
  const analyses = jobs.map(getJobAnalysis);
  const totalScore = analyses.reduce((sum, analysis) => sum + analysis.score, 0);
  const average = jobs.length ? Math.round(totalScore / jobs.length) : 0;

  elements.totalApplications.textContent = jobs.length;
  elements.interviews.textContent = jobs.filter((job) =>
    ["Intervju", "Teknisk test", "Tilbud"].includes(job.status),
  ).length;
  elements.averageMatch.textContent = `${average}%`;
}

function renderJobs() {
  elements.jobList.innerHTML = "";

  jobs.forEach((job) => {
    const card = document.createElement("article");
    card.className = `job-card ${job.id === selectedJobId ? "selected" : ""}`;
    card.tabIndex = 0;
    card.innerHTML = `
      <div>
        <h3>${job.role}</h3>
        <p>${job.company}</p>
      </div>
      <span class="status-pill">${job.status}</span>
    `;

    card.addEventListener("click", () => {
      selectedJobId = job.id;
      render();
    });

    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        selectedJobId = job.id;
        render();
      }
    });

    elements.jobList.append(card);
  });
}

function renderAnalysis() {
  const selectedJob = jobs.find((job) => job.id === selectedJobId) || jobs[0];
  const analysis = selectedJob ? getJobAnalysis(selectedJob) : null;

  renderTags(elements.profileSkills, profileSkills);

  if (!analysis) {
    elements.matchScore.textContent = "0%";
    renderTags(elements.matchedSkills, []);
    renderTags(elements.missingSkills, []);
    return;
  }

  elements.matchScore.textContent = `${analysis.score}%`;
  renderTags(elements.matchedSkills, analysis.matchedSkills);
  renderTags(elements.missingSkills, analysis.missingSkills);
}

function render() {
  renderStats();
  renderJobs();
  renderAnalysis();
}

elements.jobForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const newJob = {
    id: Date.now(),
    company: elements.companyInput.value,
    role: elements.roleInput.value,
    status: elements.statusInput.value,
    description: elements.descriptionInput.value,
  };

  jobs.unshift(newJob);
  selectedJobId = newJob.id;
  elements.jobForm.reset();
  render();
});

elements.addSampleButton.addEventListener("click", () => {
  elements.companyInput.value = "Future Tech Norge";
  elements.roleInput.value = "Junior Fullstack Developer";
  elements.statusInput.value = "Lagret";
  elements.descriptionInput.value =
    "Kandidaten bor kunne JavaScript, React, Node.js, SQL, Git, API-arbeid og grunnleggende testing.";
});

render();
