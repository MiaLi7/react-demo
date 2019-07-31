# 基于create-react-app引入router、redux、saga的脚手架搭建

## 一、背景介绍
之前我们已经试过基于`create-react-app`分别单独引入`router、redux、saga`搭建的脚手架，现在我们把`router、redux、saga`三个一起引入，并基于它们做一个简单的例子测试一下。

例子中共分为两个组件，即两个不同的页面，通过`router`实现不同页面的跳转，有一个页面使用`redux`做一个简单的计数器，另一个页面使用`saga`实现异步请求获取远端服务器的数据，并把获取到的数据显示出来。下面我们具体看看如何一起引入`router、redux、saga`搭建脚手架。


## 二、实现步骤

### 1、创建项目
选择你想要存放项目的路径，假定当前所在的文件目录为` D:\work\workspace\react` ，在目录空白处按住键盘shift键，同时鼠标右键，选择“在此处打开命令窗口”，在打开的命令行窗口中输入命令

	$ create-react-app react-demo


,其中`react-demo`是你想创建的项目名字，输入完全后，按回车，可以看到命令行窗口一直在跳动，这样`create-react-app`就会自动帮我们下载项目所要依赖的文件了，我们只要等待项目创建完成就可以了。当命令行窗口出现`Happy hacking!`，即项目创建完成，我们可以在`D:\work\workspace\react`目录下发现该目录下多了一个`react-demo`的文件夹，这就是我们创建的项目了。



### 2、项目文件目录结构
	├── node_modules                            // 项目第三方依赖文件
	├── public                                  // 放静态资源
	├── src                                     // 源码目录
	│   ├── App.css                             // 组件样式
	│   ├── App.js                              // 组件文件
	│   ├── App.test.js                         // 组件测试文件
	│   ├── index.css                           // 项目入口文件样式
	│   ├── index.js                            // 项目入口文件
	│   ├── logo.svg                            // 项目图标文件
	│   ├── serviceWorker.js                    // 资源缓存
	├── .gitignore                              // 告诉Git哪些文件不需要添加到版本管理中
	├── package-lock.json                       // 锁定安装时的包的版本号
	├── package.json                            // 项目配置文件，项目依赖包版本号
	├── README.md                               // 项目的说明文件



### 3、启动项目
创建好项目后，需要先启动项目查看项目是否能够正常运行。在命令行窗口中输入命令

	$ cd react-demo

进入项目，再输入命令

	$ npm start

启动项目，项目启动后会自动打开一个浏览器窗口加载页面，则项目启动完成。当浏览器加载页面情况如下图代表启动成功。

![启动成功](https://github.com/LiJinLan/react-demo/raw/master/react-demo-images/start.png "启动成功")


### 4、下载相关依赖
先关闭刚才启动的项目，在命令行窗口，同时按住键盘`ctrl+C`按键，在显示的命令处输入“y”即可关闭项目。今天我们做的项目分别都要用到`router、redux、saga、axios`,所以要下载相关的依赖文件。在命令行窗口依次输入

	$ npm install react-router-dom --save
	$ npm install redux --save
	$ npm install react-redux --save
	$ npm install redux-saga --save
	$ npm install axios --save

下载完成后，打开`package.json`文件，即可发现在`dependencies`中多了这些依赖版本号。
![依赖](https://github.com/LiJinLan/react-demo/raw/master/react-demo-images/package.png "依赖")


下载完依赖，就可以启动项目了，在命令行窗口输入:

	npm start


### 5、具体实现过程
#### (1). 引入redux,实现计数器组件
在src文件夹下新建一个文件夹`components`，用来存放自定义的组件及相关逻辑处理，在`components`文件下新建一个文件夹`Counter`,用来存放计数器组件。在`Couter`文件夹下新建文件`index.js`,定义计数器组件，并将组件与`store`建立连接。

`src/components/Counter/index.js`代码如下

	import React, { Component } from 'react';
	import './index.css';
	import { connect } from 'react-redux';
	import { Link } from 'react-router-dom';

	class Counter extends Component {
	  constructor( props) {
		super( props );
		this.state = {
		  counterNum: 0
		}
	  }

	  handleAdd() {
		this.props.dispatch({ type: 'ADD'});
	  }

	  handleSub() {
		this.props.dispatch({ type: 'SUB'});
	  }

	  render() {
		return (
		  <div className="counter">
			<button style={{fontSize: '18px', height: '47px', width: '147px'}}>
			  <Link to="/getSaga" style={{textDecoration: 'none', color: 'white'}}>跳转到第二页面</Link>
			</button>
			<br />
			<h1> { this.props.counterNum ?  this.props.counterNum : this.state.counterNum} </h1>
			<button onClick={this.handleAdd.bind(this)}>增加</button>
			<button onClick={this.handleSub.bind(this)}>减少</button>

		  </div>
		);
	  }
	}
	const mapStateToProps = ( state ) => {
	  return ({
		counterNum: state.handleCounter
	  });
	}

	export default connect( mapStateToProps )(Counter);


为了使页面的样式好看，在`Counter`文件夹下新建文件`index.css`。

`src/components/Counter/index.css`代码如下

	.counter {
		height: 300px;
		width: 500px;

		text-align: center;
		margin: 0 auto;
	}

	.counter button {
		margin-left: 27px;
		background-color: rgba(81,182,254,.7); 
		width: 85px;
		height: 42px;
		border-radius: 5px;
		color: white;
		font-size: 18px;
		margin-top: 30px;
	}

#### (2). 处理计数器组件的reducer
由于考虑到多页面，多组件，同时也为了体现组件化思想，所以这里我把属于哪个组件的`reducer`就放在哪个组件下，最后再通过一个总的`reducers`文件把所有的`reducer`导出来。所以`Counter`组件的`reducer`,就在`Counter`文件夹下新建一个`reducer`文件夹，里面新建文件`reducer.js`。

`src/components/Counter/reducer/reducer.js`代码如下:

	export function handleCounter(state = 0, action ) {
		switch( action.type) {
			case 'ADD':
				return state + 1;
			case 'SUB':
				return state - 1;
			default:
				return state;
		}
	}

到这里，对于`Counter`计数器组件的定义工作大体完成了，下面我们继续定义第二个组件，获取saga数据。

#### (3). 定义saga组件
因为saga组件是与Counter组件并列，所以在components文件夹下新建文件夹`GetSagaVal`,在GetSagaVal文件夹下新建文件`index.js`。

`src/components/GetSagaVal/index.js`代码如下:

	import React from 'react';
	import { connect } from 'react-redux';
	import { Link } from 'react-router-dom';

	class GetSagaVal extends React.Component {

	  handleClick() {
		this.props.dispatch({ type: 'GET'});
	  }

	  render() {
		console.log(this.props.sagaval.data[0]);
		return (
		  <div style={{marginLeft: '20px'}}>
			<h4>请点击按钮，获取第一条saga数据的名字</h4>
			<button onClick={this.handleClick.bind(this)}>获取saga数据</button>
			<h4>{ this.props.sagaval.data.length > 0 ? this.props.sagaval.data[0].name : '无'}</h4>
			<br />
			<button style={{fontSize: '18px', height: '47px', width: '147px', backgroundColor: 'rgba(81,182,254,.7)'}}>
			  <Link to="/" style={{textDecoration: 'none', color: 'white'}}>跳转到第一页面</Link>
			</button>

		  </div>
		);
	  }

	}
	const mapStateToProps = (state) => {
	  return ({
		sagaval: state.getSaga
	  });
	}

	export default connect( mapStateToProps )(GetSagaVal);

#### (4). 定义saga的generator函数，执行异步请求
由于组件化思想，同时也为了方便管理组件，所以`saga`也是放到对应的组件下面进行管理。在`GetSagaVal`文件夹下新建文件夹`sagas`,在里面新建文件`saga.js`。

`src/components/Counter/sagas/saga.js`代码如下:

	import { put, call, takeEvery } from 'redux-saga/effects';
	import axios from 'axios';

	function* workerSaga() {
	  const data = yield axios({
		method: 'get',
		url: `https://jsonplaceholder.typicode.com/users`
	  });
	  console.log( data );
	  yield put({ type: "GETSAGA", data: data});
	}


	function* watchSaga() {
	  yield takeEvery('GET', workerSaga);
	}
	export default watchSaga;

#### (5). 处理GetSagaVal组件的reducer
在`GetSagaVal`文件夹下新建文件夹`reducer`,里面新建文件`reducer.js`。

`src/components/GetSagaVal/reducer/reducer.js`代码如下:

	import React from 'react';
	import { combineReducers } from 'redux';

	export function getSaga( state = {data: []}, action) {
		switch( action.type) {
			case 'GETSAGA':
				return action.data;
			default:
				return state;
		}
	}

#### (6). 把所有组件的reducer通过一个文件导出来
之前为了方便管理，所以都是把每个组件对应的`reducer`放在相应的组件下进行管理，由于入口文件创建`store`时要用到所有的`reducer`,所以要把所有组件的`reducer`进行导出。
在src文件夹下新建文件`reducers.js`。

`src/reducers.js`代码如下：

	import { combineReducers } from 'redux';
	import * as counterReducer from './components/Counter/reducer/reducer.js';
	import * as getSagaReducer from './components/GetSagaVal/reducer/reducer.js';

	// 通过一系列异步加载来创建总reducers
	export default combineReducers({
		...counterReducer,
		...getSagaReducer
	});

#### (7). 在入口文件创建store,定义路由
修改入口文件`index.js`,并且定义路由。

src/index.js代码如下：

	import React from 'react';
	import ReactDOM from 'react-dom';
	import './index.css';
	import App from './App';
	import * as serviceWorker from './serviceWorker';
	import reducer from './reducers.js';
	import { createStore, applyMiddleware } from 'redux';
	import { Provider } from 'react-redux';
	import { BrowserRouter as Router, Route } from 'react-router-dom';
	import createSagaMiddleware from 'redux-saga';
	import Counter from './components/Counter/index.js';
	import GetSagaVal from './components/GetSagaVal/index.js';
	import saga from './components/GetSagaVal/sagas/saga.js';

	const sagaMiddleware = createSagaMiddleware();
	const store = createStore(
		reducer,
		applyMiddleware( sagaMiddleware )
	);
	sagaMiddleware.run( saga );

	ReactDOM.render(
		<Provider store={ store }>
			<Router>
				<Route exact path="/" component={ Counter }/>
				<Route path="/getSaga" component={ GetSagaVal }/>
			</Router>
		</Provider>,
		document.getElementById('root')
	);

	serviceWorker.unregister();

到这里，这个例子就已经完成了，把`router、redux、saga、axios`都引进去了。

具体文件结构如下：
![文件结构](https://github.com/LiJinLan/react-demo/raw/master/react-demo-images/structure.png "文件结构")

## 三、实现效果
刷新页面，可以看到页面初始加载的是计数器，点击增加或减少按钮，计数器的数字会相应改变，点击“跳转到第二页面按钮”，则会跳转到请求`saga`的页面，注意，url地址栏也发生了改变，一开始没有saga数据时，显示的是“无”，当点击“获取saga数据”按钮时，页面发生了改变，显示出了第一个saga数据的名字，点击“跳转到第一页面”按钮，则会返回到计数器页面，实现不同页面间的跳转。

![页面1](https://github.com/LiJinLan/react-demo/raw/master/react-demo-images/resoult2.png "页面1")


![页面2](https://github.com/LiJinLan/react-demo/raw/master/react-demo-images/resoult3.png "页面2")


![saga请求](https://github.com/LiJinLan/react-demo/raw/master/react-demo-images/resoult4.png "saga请求")
