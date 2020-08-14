
var Card = React.createClass({
  render: function() {
    var bigNameLength = this.props.data.name.length;
    for (var i = 0; i <bigNameLength; i++) {
      if (~['Ж','Ш','Щ','М','ж','ш','щ','м'].indexOf(this.props.data.name[i])) {
        bigNameLength+=0.5;
      }
    } 
    var bigName = bigNameLength > 26 ? true : false;
    if (this.props.showBack) {
      var lvlNum = this.props.data.level == 'Заговор' ? 0 : this.props.data.level.substr(0,1);
      return (
        <div className="card_back">
          <div className='number'>{lvlNum}</div>
          <div className='number2'>{lvlNum}</div>
        </div>
      );
    }
    else {
      if (
           (this.props.data.time && this.props.data.time.length)
        || (this.props.data.range && this.props.data.range.length)
        ) {return (
        <div className="card_big">
          <p>card_big</p>
          <div className="title"><span className="fs">{this.props.data.name}</span></div>
          <CardText text={this.props.data.text} bigName={bigName} size="max" font={this.props.data.font}/>
          <div className="footer">
            {this.props.data.level}
          </div>
        </div>
      );}
      else if (
           (this.props.data.components && this.props.data.components.length)
        || (this.props.data.duration && this.props.data.duration.length)
        ) {return (
        <div className="card_med">
          <p>card_med</p>
          <div className="title"><span className="fs">{this.props.data.name}</span></div>
          <div className="level">{this.props.data.type}</div>
          <div className="props">
              <div className="prop">
                <div className="propName">Время накладывания</div>
                <div className="propValue">{this.props.data.time}</div>
              </div>
              <div className="prop">
                <div className="propName">Дистанция</div>
                <div className="propValue">{this.props.data.range}</div>
              </div>
          </div>
          <CardText text={this.props.data.text} hightlevel={this.props.data.hightlevel} bigName={bigName} size="med" font={this.props.data.font}/>
          <div className="footer">
            {this.props.data.level}
          </div>
        </div>
      );}
      else {return (
        <div className="card_small">
          <p>card_small</p>
          <div className="title"><span className="fs">{this.props.data.name}</span></div>
          <div className="level">{this.props.data.type}</div>
          <div className="props">
              <div className="prop">
                <div className="propName">Время накладывания</div>
                <div className="propValue">{this.props.data.time}</div>
              </div>
              <div className="prop">
                <div className="propName">Дистанция</div>
                <div className="propValue">{this.props.data.range}</div>
              </div>
              <div className="prop">
                <div className="propName">Компоненты</div>
                <div className="propValue">{this.props.data.components}</div>
              </div>
              <div className="prop">
                <div className="propName">Длительность</div>
                <div className="propValue">{this.props.data.duration}</div>
              </div>
          </div>
          <CardText text={this.props.data.text} hightlevel={this.props.data.hightlevel} bigName={bigName} size="min" font={this.props.data.font}/>
          <div className="footer">
            {this.props.data.level}
          </div>
        </div>
      );}
    }
  }
});

var CardText = React.createClass({
  render: function() {
    var fontSizeClass = 'text';
    fontSizeClass += ' ' + this.props.size;
    fontSizeClass += ' ' + this.props.font;

    var cardText = this.props.text.map(function(pText, ind) {
      var pClass = ind == 0 ? "first" : "";
      return (
        <p className={pClass}>{pText}</p>
      );
    });
    var higherLevels = "";
    if (this.props.hightlevel && this.props.hightlevel.length) {
      higherLevels = (<HigherLevels text={this.props.hightlevel} />);
    }
    return (
      <div className={fontSizeClass}>
        <div className="level"></div>
        {cardText}
        {higherLevels}
      </div>
    );
  }
});


var HigherLevels = React.createClass({
  render: function() {
    var cardText = this.props.text.map(function(pText, ind) {
      var pClass = ind == 0 ? "first" : "";
      return (
        <p className={pClass}>{pText}</p>
      );
    });
    return (
      <div className="higherLevels">
        <div className="level">На более высоком уровне</div>
        {cardText}
      </div>
    );
  }
});

var Cards = React.createClass({
  cards : [],
  loadCommentsFromServer: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'text',
      cache: false,
      success: function(data) {
        var text = data.replace(/\r\n/g,' ')
        this.cards = JSON.parse(text);
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  getInitialState: function() {
    return {data: [], selectedClass: 'Все', showBacks: false, 
    lvl0: false,
    lvl1: false,
    lvl2: false,
    lvl3: false,
    lvl4: false,
    lvl5: false,
    lvl6: false,
    lvl7: false,
    lvl8: false,
    lvl9: false};
  },
  componentDidMount: function() {
    this.loadCommentsFromServer();
  },
  handleChange: function(event) {
    this.setState({selectedClass: event.target.value});
  },
  handleChangeLvl: function(lvl, event) {
    var lvlName = 'lvl'+lvl;
    var obj = {};
    obj[lvlName] = !this.state[lvlName];
    this.setState(obj);
  },
  showBacksChange: function(event) {
    this.setState({showBacks: !this.state.showBacks  });
  },
  render: function() {
    return (
        <div className="cards" >
          <p>This is Cards js</p>
          {this.cards.map(
            function(card) {
            return (<Card data={card} showBack={this.state.showBacks}/>);
            })
          }
        </div>
    );
  }
});

ReactDOM.render(
  <Cards url="api/cards.json" pollInterval={5000} type=""/>,
  document.getElementById('content')
);
