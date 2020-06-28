global.__basePath 	= process.cwd() + '/';
const app 			= require(__basePath + 'app/app.js');
const config 		= require(__basePath + 'app/core/configuration');
const port 			= process.env.NODE_PORT || config.get('server:index:port');

/*
 * @description Listen Server at configured port
 * @event App Listener
 */
app.listen(port, function () {
    console.log(`Listening port ${port}`);
});