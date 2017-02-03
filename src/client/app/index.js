import React from 'react';
import {render} from 'react-dom';
import ImgArea from './ImgArea';


class App extends React.Component {
    render() {
        return(
            <div>
                <ImgArea/>
            </div>
            )
    }
}

render(<App/>,document.getElementById('app'))