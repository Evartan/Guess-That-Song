const fetchToken = async (username, password) => {
    try {

        // log user in
        const response = await fetch(`${process.env.BACKEND_URI}/token`, {
            method: "POST",
            Accept: "application/json",
            headers: {
                "Content-type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                'username': username,
                'password': password,
            })
        });
        const responseJson = await response.json();
        const token = responseJson.access_token;
        if (responseJson.detail) {
            throw new Error(responseJson.detail);
        }
        
        // return access token
        return { "access_token": token }
    } catch (e) {
        console.log(e);
    }
};

export default fetchToken;
