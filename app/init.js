
import enquirer from 'enquirer';
import { getProjects } from "./helpers/directory.js";

// Get current environment configuration


export default async function app() {
	projectStart().then((exitOption) => {
		
	}).catch((ex) => {
		console.log('catch ex', ex);
	});
	
}

async function projectStart()
{
	const startOption = await showStartPrompt();
	switch(startOption) {
		case 'openproject':
			const projectToRun = await showProjectListPrompt();
				console.log('projectToRun', projectToRun);
				if (projectToRun === "returntostart"){
					projectStart();
				}
				else if (projectToRun) {
					runProject(projectToRun);
				}
			break;
		case 'exit':
		default:
			return;
			break;
	}
}

async function showStartPrompt()
{
	const startprompt = new enquirer.Select({
		name: "startoption",
		message: "What would you like to do?",
		choices: [
			{ name : 'openproject', message: 'Open project' },
			{ name : 'exit', message: 'Quit' },
		],
	});
	return await startprompt.run();
}

async function showProjectListPrompt() {
	const projects = getProjects();
	const projectOptions  = projects.map((projectDir) => { return { name: projectDir.name, message: `Project: ${projectDir.name}`}; });
	projectOptions.push( { name : 'returntostart', message: 'Return to start' });
	const projectprompt = new enquirer.Select({
		name: "project",
		message: "Select a project",
		choices: projectOptions,
	});
	return await projectprompt.run();
};

function runProject(projectname) {
	console.log('projectname', projectname);
}