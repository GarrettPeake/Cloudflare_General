import { uuid } from '@cfworker/uuid';

addEventListener("fetch", event => {
    event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
    // Extract useful data
    const body = await request.json().catch(e => null) || {}
    const req_url = new URL(request.url);
    const method = request.method;
    const route = req_url.pathname.split('/');
    const endpoint = route[1];
    const id = route.length === 3 ? route[2] : null;
    console.log('BODY: ', body);
    console.log('METHOD: ', method);
    console.log('ENDPOINT: ', endpoint);
    console.log('ID: ', id);
    
    // Handle requests for favicon (web browser requests it)
    if(endpoint == 'favicon.ico')
        return (await format_response(404, 'error', {message: 'No favicon resource'}));

    // Handle preflight requests
    if(method === 'OPTIONS')
        return format_response(null, null, null, {}, true);

    // Delegate requests to different endpoints
    if (endpoint === 'posts' && method === "GET") return posts_GET(body, id);
    if (endpoint === 'posts' && method === "PUT") return posts_PUT(body, id);
    if (endpoint === 'posts' && method === "POST") return posts_POST(body, id);
    if (endpoint === 'users' && method === "GET") return users_GET(body, id);
    if (endpoint === 'users' && method === "POST") return users_POST(body, id);
    
    // If delegation fails, return a not found response
    return (await format_response(404, 'error', {message: 'Resource or method not found'}));
}

/**
 * Provides a unified response structure based on the JSend open standard
 * @param {int} statusCode HTTP response code
 * @param {string} statusType Response status success, fail, or error
 * @param {json} data Json data structure providing reuqested data
 * @param {json} headers Optional: http headers for response
 * @param {bool} preflight specifies whether this is an options response
 * @returns formatted Repsonse object
 */
async function format_response(statusCode, statusType, data, headers={}, preflight=false){
    headers['Access-Control-Allow-Headers'] = '*';
    headers['Access-Control-Allow-Methods'] = '*';
    headers['Allow'] = '*';
    headers['Access-Control-Allow-Origin'] = '*';
    if(!preflight)
        return new Response(JSON.stringify({status: statusType, data: data}), {
            headers: headers,
            status: statusCode
        });
    return new Response(null, {
        headers: headers,
    });
}

/**
 * Gets one or all posts based on whether id is specified in URLSearchParams
 * @param {json} body body of the request
 * @param {string} id a potential id for the resource
 * @returns formatted Response object
 */
async function posts_GET(body, id){
    var data = {posts: {}};
    var post_ids = id ? {keys: [{name: id}]} : await POSTS.list();
    for (const element of post_ids.keys) {
        const value = await POSTS.get(element.name);
        data.posts[element.name] = JSON.parse(value);
    }
    return (await format_response(200, 'success', data));
}

/**
 * Catchall function for editing posts (rather than having a comments endpoint in addition)
 * @param {json} body body of the request
 * @param {string} id a potential id for the resource
 * @returns formatted Response object
 */
async function posts_PUT(body, id){
    if(POSTS.get(id)){
        await POSTS.put(id, JSON.stringify(body));
        return (await format_response(201, 'success', {'message': 'post edited with id ' + String(id)}));
    } else
        return (await format_response(400, 'fail', {'message': 'no post exists with id ' + String(id)}));
}

/**
 * Creates a post in the database
 * @param {json} body body of the request
 * @returns formatted Response object
 */
 async function posts_POST(body, id){
    const new_id = uuid();
    body.date = Math.floor(Date.now()/1000);
    await POSTS.put(new_id, JSON.stringify(body));
    return (await format_response(201, 'success', {'message': 'post created with id ' + String(new_id)}));
}

/**
 * Gets one or all users based on whether id is specified in URLSearchParams
 * @param {json} body body of the request
 * @param {string} id the username of the user
 * @returns formatted Response object
 */
 async function users_GET(body, id){
    var data = {users: []};
    var user_ids = id ? {keys: [{name: id}]} : await USERS.list();
    for (const element of user_ids.keys) {
        const value = await USERS.get(element.name);
        data.users.push(JSON.parse(value));
    }
    return (await format_response(200, 'success', data));
}

/**
 * Adds a user to the database
 * @param {json} body body of the request
 * @param {string} id a potential id for the resource
 * @returns formatted Response object
 */
async function users_POST(body, id){
    await USERS.put(id, JSON.stringify(body));
    return (await format_response(201, 'success', {'message': 'user created with id ' + String(new_id)}));
}