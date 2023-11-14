# LibLiveView
Web Library for Live View Page

```
npm i @i2v-systems/ngx-live-view
```

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 12.2.13.

### Building Library

During development the best way to consume our library is using npm link. This will allow us to symlink from a directory in our consuming application’s node modules folder to the compiled application in the library’s dist folder.

```
cd dist/ngx-live-view
npm link
```

We can link an Angular project to this library from anywhere our local machine. From the project root folder:

```
npm link @i2v-systems/ngx-live-view
```

If we now run the library with the watch flag,

```
ng build --watch
```

And at the same time run ng serve in another terminal window for our demo app.

```
ng serve
```

This will allow us to develop an application and (one or more) linked libraries simultaneously, and see the app recompile with each modification to the library’s source code.

### Library Components

Import in main module

```
import { NgxLiveViewModule } from 'ngx-live-view';
```

The library contains the following components:

- Video Grid

  - Grid
    - I2V Video Grid
      - Web Player

- Event-Card

  - Event-Details

- Tree-View

1. Video-Grid

Input properties:

| Property       | Type                                          | Default | Description                                        | Necessity |
| -------------- | --------------------------------------------- | ------- | -------------------------------------------------- | --------- |
| ViewList       | any array                                     | -       | Grid Configuaration Layout.                        | Optional  |
| inputPlayVideo | any                                           | -       | If any particulay video to play at Initialization. | Optional  |
| options        | [CustomOption](#CustomOption) []    | -       | Custom Options to pass to Grid.                    | Optional  |
| theme          | string                                        | dark    | To change theme of Video Grid. (light)             | Optional  |
| playDuplicate  | boolean                                       | false   | To play duplicate video in Grid.                   | Optional  |
| streamerIp     | string                                        | -       | To play video from different streamer.             | Optional  |
| playerserverIp | string                                        | -       | To play video from different player server.        | Optional  |
| gridMode       | string                                        | general | To change Grid Mode. (FRS - for frs)               | Optional  |
| gridView | [ViewListModel](#ViewListModel) | Grid is Set for 2X2 | Passes Grid View Configuration to Event Card.     | Optional  |
| streamer | any Array | - | To pass Multiple stream options to context menu | Optional |


Output callback Events:

| Callback       | Description                                                                                        |
| -------------- | -------------------------------------------------------------------------------------------------- |
| VideoStarted   | The callback that is called when an video is created.                                              |
| VideoClosed    | The callback that is called when an video is closed.                                               |
| ClearGridEvent | The callback that is called when we clear the Grid.                                                |
| ClickFunction  | The callback that is called when we The callback that is called when an custom function is clicked |

Example:

```
<div class="item2">
    <lib-video-grid [ViewList]=" {id: 2, Text: '2x1', heading: '2 cameras', Rows: 2, Cols: 1}, { id: 3, Text: '1+2', heading: '3 cameras', Rows: 2, Cols: 2,      hasSpecial: true, SpecialElement: 0, SEWidth: 2, SEHeight: 1, NumberofTiles: 3, }"
        [inputPlayVideo]="ExampleInputvideoObject"
        [theme]="light"
        [stream] = "[{ name: 'Analytic Stream VIDS', streamType: "1",  analyticType: "VIDS" }]"
        [streamerIp]="192.168.x.x"
        [playerserverIp]="192.168.x.x"
        [gridMode]="FRS"
        [playDuplicate]="true"
        [options]="[{Title : 'clickSnapShot', Callback: 'snapshot', Icon :'camera_enhance'}]"
        [gridView]="{ id: 5,Text: '1 + 5',heading: '6 cameras',Rows: 3,      Cols: 3,
        hasSpecial: true,
        SpecialElement: 0,
        SEWidth: 2,
        SEHeight: 2,
        NumberofTiles: 6}"
        (VideoStarted)="onVideoStarted($event)"
        (ClearGridEvent)="GridClear()"
        (VideoClosed)="onVideoClosed($event)">
        (ClickFunction)="VideoGridFunctionCallback($event)">
        
    </lib-video-grid>
  </div>
```

2. Event-Card

Input properties:

| Property   | Type                    | Default | Description                          | Necessity |
| ---------- | ----------------------- | ------- | ------------------------------------ | --------- |
| queueLimit | number                  | 10      | No. of events to be stored in Queue. | Optional  |
| toolbaroptions    | [CustomOption](#CustomOption) [] | -       | Custom Options to pass to Grid.      | Optional  |
| filters    | [FilterModel](#FilterModel) []                  | -       | Passes filter to Event Card.         | Optional  |
| properties | any[]                       | -       | Passes properties to show in Event Card.     | Optional  |
| cardOptions | [CustomOption](#CustomOption) []                      | -       | Passes options to show in Event Card.     | Optional  

Output callback Events:

| Callback          | Description                                                    |
| ----------------- | -------------------------------------------------------------- |
| dblclickEventCard | The callback that is called when double click on Event Card    |
| ClickFunction     | The callback that is called when an custom function is clicked |

Example:

```
<div class="item3">
    <lib-event-card
      (dblclickEventCard)="EventCardDblClickCallback($event)"
      (ClickFunction)="EventCardFunctionCallback($event)"
      [queueLimit]="10"
      [toolbarOptions]="[{ Title: 'clickSnapShot', Callback: 'snapshot', Icon: 'camera_enhance'}, { Title: 'clickSnapShot', Callback: 'snapshot', Icon: 'camera_enhance' }]"
      [filters]="[{ name: 'Area Name', type: 'multiselect', values: ['Area 1', 'Area 2', 'Area 3', 'Area 4']}, { name: 'Camera Name', type: 'array',values:['Camera1', 'Camera2', 'Camera3']
      }, { name: 'Wanted', type: 'boolean', values: ['true', 'false'] }, { name: 'Color', type: 'array', values: ['Red', 'Green', 'Blue'] }]"
      [cardOptions]="[{ Title: 'clickSnapShot', Callback: 'snapshot', Icon: 'camera_enhance' }]">
      [properties]="['cameraName', 'areaName', 'time', 'color', 'wanted']"
    }" 
    </lib-event-card>

  </div>
```

3. Tree-View

Input properties:

| Property        | Type                | Default                                                         | Description                          |
| --------------- | ------------------- | --------------------------------------------------------------- | ------------------------------------ |
| queueLimit      | number              | 10                                                              | No. of events to be stored in Queue. |
| toolbarButtons  | toolbarButtonsModel | {"id": "refresh", "matIcon": "autorenew", "toolTip": "Refresh"} | Passes Button to toolbar             |
| availableGroups | any                 | -                                                               | Pass Availabale Group to Tree.       |
| theme           | string              | dark                                                            | passes theme to Tree                 |

Output callback Events:

| Callback               | Description                                                            |
| ---------------------- | ---------------------------------------------------------------------- |
| NodeSelected           | The callback that is called when select a node                         |
| NodeUnSelected         | The callback that is called when we unselect a node                    |
| NodeChecked            | The callback that is called when we check a node                       |
| NodeUnChecked          | The callback that is called when we uncheck a node                     |
| NodeSingleClick        | The callback that is called when single click on Node                  |
| NodedoubleClick        | The callback that is called when double click on node                  |
| NodeContextmenuClicked | The callback that is called when we click Context Menu                 |
| toolbarButtonClicked   | The callback that is called when an toolabr custom function is clicked |
| NodeExpand             | The callback that is called when we expand an node                     |

Example:

```
<div class="item1" style="width: 15%;">
    <lib-tree-view [treeID]="treeId"
    [toolbarButtons]="toolbarButtons"
    (NodeSelected)="CallBackNodeSelected($event)"
    (NodeSingleClick)="CallBackNodeSingleClick($event)"
    (NodeDoubleClick)="CallBackNodeDoubleClick($event)"
    (NodeContextmenuClicked)="CallBackNodeRightClick($event)"
    (NodeExpand)="CallBackNodeExpanded($event)"

    ></lib-tree-view>
  </div>
```

### Library Services

The library contains the following services:

- Ngx-live-view.service
- Tree-View.service

1. Ngx-live-view.service

Subjects :

| Name                | Description                                               | Model               |
| ------------------- | --------------------------------------------------------- | ------------------- |
| eventsCards         | The subject is used to pass events to event cards         | IEvent[]            |
| playVideo           | Used to play video in Grids either on node drop or clicks | playVideo[]         |
| notificationemitter | Used to emit notification from library to app             | NotificationModel[] |

2. Video-Grid.service

Methods :

| Name    | Description          |
| ------- | -------------------- |
| resizer | Used to resize Grids |

2. Tree-View.service

Methods :

| Name                  | Description                                                 |
| --------------------- | ----------------------------------------------------------- |
| createNode            | Used to create Node                                         |
| getTreeObject         | Used to get Tree Object as per Tree Id                      |
| getTreeNodeByParam    | Used to get Tree Node By Param                              |
| insertNodes           | Used to insert nodes                                        |
| getTreeNodeById       | Used to get Tree Node By Id                                 |
| getTreeNodeByRandomId | Used to get Tree Node By Random Id                          |
| getTreeNodeByName     | Used to get Tree Node By Name                               |
| isNodeChecked         | Used to check if Node is Checked                            |
| checkNode             | Used to Check Node                                          |
| removeAllChildNodes   | Used to remove all Child Node                               |
| selectNode            | Used to select node                                         |
| getParentNode         | Used to get Parent Node                                     |
| deleteNode            | Used to Delete Node                                         |
| getFirstNode          | Used to get First Node                                      |
| updateNode            | Used to update Nodes                                        |
| deSelectAllNodes      | Used to Deselect all Nodes as per Tree ID                   |
| deSelectNode          | Used to Deselect any Node as per Tree ID and node           |
| isTreeIntilized       | Check If tree is initialized or not as per Tree ID          |
| getAllNodes           | To get all nodes of Any Tree ID                             |
| clearTree             | It clears the tree by destroying it and then recreating it. |
| getSelectedNodes      | Get the selected nodes from the tree object.                |

### Library Models

The library contains the following Models:

- #### IEventCard
- #### CustomOption
- #### treeToolbarButtonModel
- #### ZTreeModel
- #### FilterModel
- #### NotificationModel
- #### ViewListModel

