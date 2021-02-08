import path from "path";
import fs from "fs-extra";
import enquirer from 'enquirer';
import { getProjectConfigPath, getProjectRunSettingsPath, getTemplateScriptPath, getProjectPath } from "./directory.js";


export async function initiateProject(projectname) {
	const projectconfig = getProjectConfig(projectname);
	initiateRunSettings(projectname, projectconfig);
	
	if (!projectconfig) {
		console.error(`Unable to find config for ${projectname}`);
	 	return "error";
	}
	
	console.log(`### K6 Manager - Project: ${ projectconfig.name }`);
	const runSettings = getRunSettings(projectname);
	outputCurrentRunSettings(runSettings);

	const promptoption = await showProjectOptionPrompt(projectconfig.name);
	switch(promptoption) {
		case "changerunsettings":
		
		// case 'exit':
		// default:
		// 	return 'back';
		break;
		case "runtest":
			await runTest(projectname);
			break;
	}
}

async function showProjectOptionPrompt(projectname) {
	const projectoptionprompt = new enquirer.Select({
		name: "projectoption",
		message: `Options for project ${projectname}`,
		choices: [
			{ name : 'runtest', message: 'Run test with current settings' },
			{ name : 'changerunsettings', message: 'Change test run settings - NOT IMPLEMENTED' },
			{ name : 'exit', message: 'Quit' },
		],
	});
	return projectoptionprompt.run();
}


function initiateRunSettings(projectname, projectconfig) {
	if (fs.pathExistsSync(getProjectRunSettingsPath(projectname))) {
		return;
	}

	const environment = (projectconfig?.environments && Object.entries(projectconfig.environments).length > 0) ? Object.entries(projectconfig.environments)[0][0] : 'unkown';
	const stage = (projectconfig?.stages && Object.entries(projectconfig.stages).length > 0) ? Object.entries(projectconfig.stages)[0][0] : 'unkown';
	const suite = (projectconfig?.suites && Object.entries(projectconfig.suites).length > 0) ? Object.entries(projectconfig.suites)[0][0] : 'unkown';
	
	fs.writeJsonSync(getProjectRunSettingsPath(projectname), { 
		"environment": environment,
		"stage": stage,
		"suite": suite
	});
	
}

function outputCurrentRunSettings(settings) {
	console.log('#### Current project settings');
	Object.entries(settings).forEach(([key, value]) => {
		console.log(`# - ${key}: ${value}`);
	});
	console.log('####\n');
 
}
function getRunSettings(projectname) {
	const settings = fs.readJsonSync(getProjectRunSettingsPath(projectname));
	return settings;
}

function getProjectConfig(projectname) {
	const config = fs.readJsonSync(getProjectConfigPath(projectname));
	return config;
}

async function runTest(projectname) {
	const result = await createTestScript(projectname);
}

async function createTestScript(projectname)
{
	const projectPath = getProjectPath(projectname);
	const template = fs.readFileSync(getTemplateScriptPath(), {encoding: 'utf8', flag: 'r'})
	const projectconfig = getProjectConfig(projectname);
	const runSettings = getRunSettings(projectname);

	let script = template;
	script = script.replace("/*%BASEURL%*/", projectconfig.environments[runSettings.environment].baseurl);
	script = script.replace("/*%ENVNAME%*/", runSettings.environment);

	const suitepath = path.join(projectPath, projectconfig.suites[runSettings.suite].path);
	if (fs.pathExistsSync(suitepath)) {
		const suite = fs.readFileSync(suitepath, {encoding:'utf8', flag:'r'});
		script = script.replace("/*%PAGES%*/", suite);
	}

	script = script.replace("/*%STAGES%*/", JSON.stringify(projectconfig.stages[runSettings.stage].stages));
	
	const scriptPath = path.join(projectPath, "k6script.js");
	fs.writeFileSync(scriptPath, script, 'utf8');
	console.log(`Wrote K6 script file to ${scriptPath}\n\n`);
	console.log('Use the following command to run script:')
	console.log('--------------------------------------------------------------------------')
	console.log(`k6 run ${path.resolve(scriptPath)}`);
	console.log('--------------------------------------------------------------------------')
}