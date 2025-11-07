import axios from 'axios';
 
let requestCounts = {
rawg: { count : 0, lastReset : Date.now()}
}

function checkRateLimit(apiName){
if(Date.now()-requestCounts[apiName].lastReset > 6000){
requestCounts.count=0; 
requestCounts.lastReset=Date.now()
}
  if (apiName === 'rawg' && limit.count >= 10000) {
    throw new Error('RAWG: Monthly limit reached!');
  }

requestCounts[apiName].count++;

}
export async function makeSimpleApiCall(url, apiName = 'generic') {
  try {
    checkRateLimit(apiName);
    
    console.log(`📡 Calling: ${url}`);
    const response = await axios.get(url, { timeout: 10000 });
    
    console.log(`✅ Success!`);
    return response.data;
    
  } catch (error) {
    console.log(`❌ Failed: ${error.message}`);
    throw error;
  }
}