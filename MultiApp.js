cfg.Light, cfg.MUI;
app.LoadPlugin( "Support" );
app.LoadPlugin( "Utils" )
//Load external scripts.
app.Script( "Home.js" );
app.Script( "About.js" );
app.Script( "File.js" );
app.Script( "Utils.js" );

//Init some global variables.
var appPath = "/sdcard/MultiApp";
var curMenu = "Home";
var curPage = null;

//Called when application is started.
function OnStart()
{    
	utils = app.CreateUtils();
    //Lock screen orientation to Portrait.
    app.SetOrientation( "Portrait" );
    
    //Create and set a 'material style' theme.
    CreateTheme();
    
    //Create a local storage folder.
    app.MakeFolder( appPath );
    
	//Create the main app layout with objects vertically centered.
	layMain = app.CreateLayout( "Linear", "FillXY" );
	layMain.SetBackColor( "#ffffff" );

    //Create main controls and menus.
	CreateActionBar();
	CreateMenuBar();
	CreatePageContainer();
	CreateDrawer();
	
	
	
	//Create page/dialog objects.
    home = curPage = new Home( appPath, layContent );
    about = new About();
	file = new File( appPath, layContent );
	
	//Add main layout and drawer to app.	
	app.AddLayout( layMain );
	app.AddDrawer( drawerScroll, "Left", drawerWidth );
	
	//List files on menu and show home page.
	ShowFiles();
	home.Show( true, "Home" );
	
	//Detect keyboard showing.
    app.SetOnShowKeyboard( app_OnShowKeyBoard );
    
    //Prevent back key closing the app.
    app.EnableBackKey( false );
}

function CreateMenuBar()
{
	//Create horizontal layout for top bar.
    layHoriz2 = app.CreateLayout( "Linear", "Horizontal,FillX,Left" );
   colorx = utils.RandomHexColor(false);
   co = utils.GetGradientColors(colorx);
     layHoriz2.SetBackGradient( co[0],colorx,  co[1]);
    //color.ORANGE_LIGHT_3, color.ORANGE_DARK_2, color.ORANGE_ACCENT_2 );
    layMain.AddChild( layHoriz2 );
		layHoriz2.SetSize( 1.0, 0.0981 );
//layHoriz2.SetCornerRadius( 5 );
//layHoriz2.SetElevation( 5 );

mh = new Array();
mv = new Array();
mi = new Array();
mt = new Array();
mi = ["Ok","Left","Up","Down","Right"];
mi2 = ["pix","arrow_left","arrow_drop_up","arrow_drop_down","arrow_right"];
//mi = ["Home","","","","Settings"];
//mi2 = ["home","","","","settings"];
nucol = utils.RandomHexColor(true);
for(c=0;c<5;c++){
mh[c] = app.CreateLayout( "Linear", "Vertical" );
mh[c].SetSize(0.20, 1.0);
if(c==0) mh[c].SetBackColor(nucol);
layHoriz2.AddChild( mh[c] );
for(d=0;d<2;d++){
mv[d] = app.CreateLayout( "Linear", "Vertical,VCenter,Bottom" );
//if(d==0) { mv[d].SetSize(1.0, 0.25);}else{mv[d].SetSize(1.0, 1.75);}
//if(d==0) mv[d].SetBackColor("#ef000000");
if(d==0) mt[c] = app.CreateText( mi2[c] ), mt[c].SetMargins(0.01,0.01,0.01,0.01), mt[c].index = c, mt[c].SetOnTouch(mt_OnTouch),mt[c].SetFontFile("Misc/MaterialIcons-Regular.ttf"), mv[d].AddChild(mt[c]), mt[c].SetTextSize(24), mt[c].SetTextColor("#ffffff"), mt[c].SetTextShadow(5,0,0,"#000000");
if(d==1) mt[c] = app.CreateText( mi[c] ), mv[d].AddChild(mt[c]), mt[c].index = c, mt[c].SetOnTouch(mt_OnTouch),mt[c].SetTextColor("#ffffff"), mt[c].SetTextShadow(5,0,0,"#000000");
//if(d==0) mv[d].SetSize(-1, 0.45);
//app.AddText( mv[d], mi[c] );
mh[c].AddChild(mv[d]);
}
}
}



function mt_OnTouch(event)
{
//alert(utils.GetMethods());
self = this;
//alert(self.GetText());
if(event.action == "Down") {
for(rt=0;rt<5;rt++){
mh[rt].SetBackColor("#00000000");
}
mh[self.index].Animate("Rubberband",null, 1250);
mh[self.index].SetBackColor(nucol);
if(mi[self.index]=="Home" ) ChangePage( home, "Home" ),txtMenu.SetText( "[fa-home]" )
//Test below
else if(mi[self.index]=="Settings" ) settings.Show(), txtMenu.SetText( "[fa-arrow-circle-o-left]" )
else /*ChangePage( file, mi[self.index] ),*/ txtMenu.SetText( "[fa-arrow-circle-o-left]" );
    
}

if(event.action == "Up") {
for(rt=0;rt<5;rt++){
//mh[rt].SetBackColor("#00000000");
}
mh[self.index].Animate("Tada",null, 750);
mh[self.index].SetBackColor("#a969ea69");
if(mi[self.index]=="Home" ) ChangePage( home, "Home" ),txtMenu.SetText( "[fa-home]" )
//Test below
else if(mi[self.index]=="Settings" ) settings.Show(), txtMenu.SetText( "[fa-arrow-circle-o-left]" )
else /*ChangePage( file, mi[self.index] ),*/ txtMenu.SetText( "[fa-arrow-circle-o-left]" );
    
}
}

//Create area for showing page content.
function CreatePageContainer()
{
    layContent = app.CreateLayout( "Frame", "VCenter,FillXY" );
    layContent.SetSize( 1, 0.95 );
    layMain.AddChild( layContent );
}
   
//Swap the page content.
function ChangePage( page, title, force )
{ 
    //Check for changes.
    if( !force && curPage.IsChanged() )
    {
        var yesNoSave = app.CreateYesNoDialog( "Discard Changes?" );
	    yesNoSave.SetOnTouch( function(ret){if(ret=="Yes") ChangePage(page,title,true)} );
	    yesNoSave.Show();
        return;
    }
    
    //Fade out current content.
    if( home.IsVisible() ) home.Show( false );
    if( file.IsVisible() ) file.Show( false );
    
    //Fade in new content.
    page.Show( true, title );
    
    //Highlight the chosen menu item in the appropriate list.
    if( curMenuList==lstMenuMain ) lstMenuFiles.SelectItemByIndex(-1);
    else lstMenuMain.SelectItemByIndex(-1);
    curMenuList.SelectItem( title );
    
    //Set title and store current page.
    txtBarTitle.SetText( title );
    curMenu = title;
    curPage = page;
}

//Called when back button is pressed.
function OnBack()
{
    if( file.IsVisible() ) {
        curMenu = "Home";
        ChangePage( home, curMenu );
    }
    else {
        var yesNo = app.CreateYesNoDialog( "Exit the app?" );
    	yesNo.SetOnTouch( function(result){ if(result=="Yes") app.Exit()} );
    	yesNo.Show();
    }
}

//Called when harware menu key pressed.
function OnMenu( name )
{  
   app.OpenDrawer();
}

//Handle soft-keyboard show and hide.
//(Re-size/adjust controls here if required)
function app_OnShowKeyBoard( shown )
{
}

//Create a theme for all controls and dialogs.
function CreateTheme()
{
    theme = app.CreateTheme( "Light" );
    theme.AdjustColor( 35, 0, -10 );
    theme.SetBackColor( "#ffffffff" );
    theme.SetBtnTextColor( "#000000" );
    theme.SetButtonOptions( "custom" );
    theme.SetButtonStyle( "#fafafa","#fafafa",5,"#999999",0,1,"#ff9000" );
    theme.SetCheckBoxOptions( "dark" );
    theme.SetTextEditOptions( "underline" );
    theme.SetDialogColor( "#ffffffff" );
    theme.SetDialogBtnColor( "#ffeeeeee" );
    theme.SetDialogBtnTxtColor( "#ff666666" );
    theme.SetTitleHeight( 42 );
    theme.SetTitleColor( "#ff888888" ); 
    theme.SetTitleDividerColor( "#ff0099CC" );
    theme.SetTextColor( "#000000" );
    app.SetTheme( theme );
}

//Create an action bar at the top.
function CreateActionBar()
{
    //Create horizontal layout for top bar.
    layHoriz = app.CreateLayout( "Linear", "Horizontal,FillX,Left" );
    layHoriz.SetBackColor( "#4285F4" );
    layMain.AddChild( layHoriz );
    
    //Create menu (hamburger) icon .
    txtMenu = app.CreateText( "[fa-bars]", -1,-1, "FontAwesome" );
    txtMenu.SetPadding( 12,10,12,10, "dip" );
    txtMenu.SetTextSize( 28 );
    txtMenu.SetTextColor( "#eeeeee" );
    txtMenu.SetOnTouchUp( function(){app.OpenDrawer()} );
    layHoriz.AddChild( txtMenu );
    
    //Create layout for title box.
    layBarTitle = app.CreateLayout( "Linear", "Horizontal" );
    layBarTitle.SetSize( 0.73 );
    layHoriz.AddChild( layBarTitle );
    
    //Create title.
    txtBarTitle = app.CreateText( "MultiApp", -1,-1, "Left" );
    txtBarTitle.SetMargins(0,10,0,0,"dip");
    txtBarTitle.SetTextSize( 22 );
    txtBarTitle.SetTextColor( "#ffffff" );
    txtBarTitle.SetTextShadow( 5, 0,0, "#000000" );
    layBarTitle.AddChild( txtBarTitle );
    txtBarTitle.SetFontFile( "Misc/Anastasia.otf" );
    
    /*    
    //Create search icon.
    txtSearch = app.CreateText( "[fa-search]", -1,-1, "FontAwesome" );
    txtSearch.SetPadding( 12,2,12,10, "dip" );
    txtSearch.SetTextSize( 24 );
    txtSearch.SetTextColor( "#eeeeee" );
    txtSearch.SetOnTouchUp( function(){app.ShowPopup("Todo!")} );
    layHoriz.AddChild( txtSearch );
    */
}

//Called when a drawer is opened or closed.
function OnDrawer( side, state )
{
    console.log( side + " : " + state );
}

//Create the drawer contents.
function CreateDrawer()
{
    //Create a layout for the drawer.
	//(Here we also put it inside a scroller to allow for long menus)
	drawerWidth = 0.75;
    drawerScroll = app.CreateScroller( drawerWidth, 1 );
    drawerScroll.SetBackColor( "White" );
	layDrawer = app.CreateLayout( "Linear", "Left" );
	drawerScroll.AddChild( layDrawer );
	
	//Create layout for top of drawer.
	layDrawerTop = app.CreateLayout( "Linear", "Left" );
	layDrawerTop.SetBackColor( "#4285F4" );
	layDrawerTop.SetSize( drawerWidth );
	layDrawer.AddChild( layDrawerTop );
	
	//Add an icon to top layout.
	var img = app.CreateImage( "Img/Hello.png", 0.15 );
	img.SetMargins( 0.02,0.02,0.02,0.01 );
	layDrawerTop.AddChild( img );
	
	//Add app name to top layout.
	var txtName = app.CreateText( "MultiApp",-1,-1,"Bold");
	txtName.SetMargins( 0.04,0.01,0.02,0.02 );
	txtName.SetTextColor( "White" );
	txtName.SetTextSize( 14 );
	layDrawerTop.AddChild( txtName );
	
	//Create menu layout.
	var layMenu = app.CreateLayout( "Linear", "Left" );
	layDrawer.AddChild( layMenu );
	
    //Add a list to menu layout (with the menu style option).
    var listItems = "MultiApp::[fa-home],About::[fa-question-circle],New File::[fa-plus]";
    lstMenuMain = app.CreateList( listItems, drawerWidth, -1, "Menu,Expand" );
    lstMenuMain.SetColumnWidths( -1, 0.35, 0.18 );
    lstMenuMain.SelectItemByIndex( 0, true );
    lstMenuMain.SetItemByIndex( 0, "MultiApp" );
    lstMenuMain.SetOnTouch( lstMenu_OnTouch );
    layMenu.AddChild( lstMenuMain );
    curMenuList = lstMenuMain;
    
    //Add seperator to menu layout.
    var sep = app.CreateImage( null, drawerWidth,0.001,"fix", 2,2 );
    sep.SetSize( -1, 1, "px" );
    sep.SetColor( "#cccccc" );
    layMenu.AddChild( sep );
    
    //Add title between menus.
	txtTitle = app.CreateText( "Files",-1,-1,"Left");
	txtTitle.SetTextColor( "#666666" );
	txtTitle.SetMargins( 16,12,0,0, "dip" );
	txtTitle.SetTextSize( 14, "dip" );
	layMenu.AddChild( txtTitle );
	
    //Add a second list to menu layout.
    lstMenuFiles = app.CreateList( "", drawerWidth,-1, "Menu,Expand" );
    lstMenuFiles.SetColumnWidths( -1, 0.35, 0.18 );
    lstMenuFiles.SetIconSize( 24, "dip" );
    lstMenuFiles.SetOnTouch( lstMenu_OnTouch );
    lstMenuFiles.SetOnLongTouch( lstMenu_OnLongTouch );
    layMenu.AddChild( lstMenuFiles );
}

//Handle menu item selection.
function lstMenu_OnTouch( title, body, type, index )
{
    curMenuList = this;
    
    //Handle new file creation.
    if( title=="New File" ) { 
        app.ShowTextDialog( "File Name", "", OnAdd );
        return;
    }
    else if( title=="About" ) {
        about.Show();
        app.CloseDrawer( "Left" );
        return;
    }
    
    //Handle page changes.
    curMenu = title;
    if( title=="Home" ) ChangePage( home, title );
    else ChangePage( file, title );
    
    //Close the drawer.
    app.CloseDrawer( "Left" );
}

//Handle menu long press.
function lstMenu_OnLongTouch( title, body, type, index )
{
    curMenuList = this;
    curMenu = title;
    
    //Show options dialog.
    var sOps = "Rename,Delete" 
    lstOps = app.CreateListDialog( "Actions", sOps, "AutoCancel" );
    lstOps.SetOnTouch( lstOps_Select ); 
    lstOps.Show();
}

//Handle menu item selection.
function lstOps_Select( item )
{
    if( item=="Delete" ) 
    {
        var msg = "Are you sure you want to delete '" + curMenu + "' ?"
        yesNo = app.CreateYesNoDialog( msg );
        yesNo.SetOnTouch( yesNoDelete_OnTouch );
        yesNo.Show();
    }
    else if( item=="Rename" ) {
        app.ShowTextDialog( "Rename Program", curMenu, OnRename );
    }
}

//Handle delete 'are you sure' dialog.
function yesNoDelete_OnTouch( result )
{
    if( result=="Yes" ) 
    {
        //Delete the file and refresh list.
        app.DeleteFolder( appPath+"/" + curMenu );
        ShowFiles();
        ChangePage( home, "Home" );
    }
}

//Called after user enters renamed program.
function OnRename( name )
{
    //Check up name.
	if( !isValidFileName(name) ) {
		alert( "Name contains invalid characters!" );
		app.ShowTextDialog( "Rename Program", curMenu, "OnRename" );
		return;
	}
	
    //Check if already exists.
    var fldr = appPath+"/"+name;
    if( app.FolderExists( fldr ) ) {
        app.Alert( "App already exists!" );
    }
    else {
        //Rename the .json data file.
        var oldfile = appPath+"/"+curMenu+"/"+curMenu+".json";
        var newfile = appPath+"/"+curMenu +"/"+name+".json";
        if( app.FileExists( oldfile ) ) app.RenameFile( oldfile, newfile );
        
        //Rename folder and refresh list.
        app.RenameFile( appPath+"/"+curMenu, appPath+"/"+name );
        ShowFiles();
        ChangePage( file, name );
    }
}

//Called after user enters new file name.
function OnAdd( name, type )
{
	//Check up name.
	if( !isValidFileName(name) ) {
		alert( "Name contains invalid characters!" );
		app.ShowTextDialog( "File Name", "", OnAdd );
		return;
	}
    var fldr = appPath+"/"+name;
    if( app.FolderExists( fldr ) ) {
        app.Alert( "App already exists!" );
    }
    else {
        app.MakeFolder( fldr );
        app.MakeFolder( fldr +"/Img" );
        
        //Start new file and refresh list.
        curMenuList = lstMenuFiles;
        ChangePage( file, name );
        file.Save();
        ShowFiles();
    }
    app.CloseDrawer( "Left" );
}

//Get user files list.
function GetFileList()
{    
    var fileList = "";
    var list = app.ListFolder( appPath,"",0,"alphasort");
    for( var i=0; i<list.length; i++ )
    {
        if( app.FileExists( appPath+"/"+list[i]+"/"+list[i]+".json" ) ) 
		{
            if( fileList.length>0 ) fileList += ",";
            fileList += list[i];
        }
    }
    return fileList;
}

//Update menus to show list of file.
function ShowFiles()
{
    //Get list of user's file.
    var fileList = GetFileList().split(",");
    
    //Create a menu item for each app.
    var  list = "";
    for( var i=0; i<fileList.length && fileList[0]!=""; i++ )
    {
        if( list.length>0 ) list += ",";
        f = JSON.parse(app.ReadFile( appPath+"/"+fileList[i]+"/"+fileList[i]+".json" ));
        //alert(fileList[i]);
        list += fileList[i] + ":" + f.image;//"::[fa-file]";
    }
    lstMenuFiles.SetList( list );
}