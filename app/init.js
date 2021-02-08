import enquirer from 'enquirer';
import { getProjects } from "./helpers/directory.js";
import  { initiateProject } from "./helpers/project.js";

export default async function app() {
	const initialProject = process.env["K6_PROJECT"] ?? null;
	if (initialProject) {
		openProject(initialProject);
	}
	else {
		showStartView().then((exitOption) => {
		}).catch((ex) => {
			console.log('catch ex', ex);
		});
	}
}

async function showStartView()
{
	const startOption = await showStartPrompt();
	switch(startOption) {
		case 'openproject':
			const projectToRun = await showProjectListPrompt();
				if (projectToRun === "back"){
					showStartView();
				}
				else if (projectToRun) {
					openProject(projectToRun);
				}
			break;
		case 'exit':
		default:
			return;
			break;
	}
}

function openProject(projectname)
{
	initiateProject(projectname).then((status) => {
		console.log('project run status', status);
		if (status === 'error'){
			console.log(`Something went wrong in the project "${projectToRun}"`);
		}
		if (status === 'back'){
			showStartView();
		}
		
	}).catch((ex) => {
		console.log('project run exception', ex);
	});
}

async function showStartPrompt()
{
	console.clear();
	console.log(`### K6 Manager - Start`);
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
	console.clear();
	console.log(`### K6 Manager - Select project`);
	const projects = getProjects();
	const projectOptions  = projects.map((projectDir) => { return { name: projectDir.name, message: `Project: ${projectDir.name}`}; });
	projectOptions.push( { name : 'back', message: 'Return to start' });
	const projectprompt = new enquirer.Select({
		name: "project",
		message: "Select a project",
		choices: projectOptions,
	});
	return await projectprompt.run();
};
