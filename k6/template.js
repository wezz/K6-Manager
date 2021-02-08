import http from 'k6/http';
import { check, sleep, group } from 'k6';

const envname = "/*%ENVNAME%*/";
const pages = /*%PAGES%*/;
const baseurl = "/*%BASEURL%*/";

export let options = { stages: /*%STAGES%*/ };
export default function () {
	console.log(`### Running tests against environment "${envname}". Baseurl : "${baseurl}" `)
	let response;
  
	Object.keys(pages).map((pagename) => {
	  const page = pages[pagename];
	  const pageurl = (page[envname] && page[envname].url) ? page[envname].url : '';
	  
  
	  if (pageurl) {
		group(
		  `${pagename} - Url: "${pageurl}"` ,
		  function () {
			response = http.get(baseurl + pageurl);
			check(response, { 'status was 200': (r) => r.status == 200 });
			sleep(1);
		  }
		);
	  }
	  else {
		console.log(`unable to get url for "${pagename}"' in env "${envname}". `, JSON.stringify(page[envname]));
	  }
	  
	});
	
	
  }