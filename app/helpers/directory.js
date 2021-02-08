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

export function getProjectPath(){
	return process.env["K6_PROJECTPATH"] ?? "./projects";
}