const electron = require('electron');
const { app, BrowserWindow, Menu, ipcMain } = electron;


let mainWindow;
let addWindow;

app.on('ready', () => {
	mainWindow = new BrowserWindow({});
	mainWindow.loadURL(`file://${__dirname}/main.html`);
	mainWindow.on('closed', () => app.quit());

	const mainMenu = Menu.buildFromTemplate(menuTemplate);
	Menu.setApplicationMenu(mainMenu);

});

function createAddWindow() {
	addWindow = new BrowserWindow({
		width: 300,
		height: 200,
		title: 'Create a New Todo',
	});
	addWindow.loadURL(`file://${__dirname}/newTodo.html`);
	addWindow.on('close', () => addWindow = null); 
	//we can do this after the ```addWindow.close()``` by simply adding ```addWindow = null``` but that will be not the good method
}

ipcMain.on('todo:add', (event, todo) => {
	mainWindow.webContents.send('todo:add', todo);
	addWindow.close();//this does not free up the memory bcz we are only closing it not dereferencing it
});



const menuTemplate = [
	{
 		label: 'File',
		submenu : [
			{
				label: 'Add Todo',
				//check immediate invoked function syntax by today!
				accelerator : process.platform === 'darwin' ? 'Command+N' : 'Control+N',

				click() {
					createAddWindow();
				}
			},
			{
				label: 'Clear Todo',
				accelerator: process.platform === 'darwin' ? 'Command+Shift+C' : 'Control+Shift+C',

				click() {
					mainWindow.webContents.send('todo:clear');
				}
			},
			{
				label: 'Quit',
				accelerator : process.platform === 'darwin' ? 'Command+Q' : 'Control+Q',				

				click() {
					app.quit();
				}
			},

		]


	}
];


if (process.platform === 'darwin') {
	menuTemplate.unshift({});
}


//this is for debugger if ! used hmara developer option udd jayega
if (process.env.NODE_ENV !== 'production') { //'production', 'development', 'testing', 'staging'
	menuTemplate.push({
		label: 'Developer',
		submenu: [
			{
				role: 'reload'
			},

			{
				label: 'Toggle Developer Mode',
				accelerator: 'Control+I', 
				//focusedWindow is reference to the currently selected window
				click(item, focusedWindow) {
					focusedWindow.toggleDevTools();

				}
			}
		],
	});
}