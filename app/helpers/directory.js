import fs from "fs-extra";
import path from "path";

export function getDirectories(srcpath = '.') {
	return fs.readdirSync(srcpath)
    .map(item => {
		const mappedPath = path.join(srcpath, item);
		const  mappedDir = {
			name: item,
			path: mappedPath,
			idDirectory: fs.statSync(mappedPath).isDirectory()
		};
		return mappedDir;
	})
    .filter(item => { return !item.isDirectory; });
}

export function getProjects() {
	const projectpath = getProjectPath();
	const directories = getDirectories(projectpath);
	return directories;
}

export function getProjectPath(projectname = ""){
	return path.join(process.env["K6_PROJECTPATH"] ?? "./projects", projectname);
}

export function getProjectConfigPath(projectname) {
	const projectPath = path.join(getProjectPath(), projectname);
	return path.join(projectPath, "config.json");
}
export function getProjectRunSettingsPath(projectname) {
	const projectPath = path.join(getProjectPath(), projectname);
	return path.join(projectPath, "runsettings.tmp.json");
}

export function getTemplateScriptPath(projectname) {
	const templatePath = process.env["K6_TEMPLATEPATH"] ?? "./k6/";
	return path.join(templatePath, "template.js");
}