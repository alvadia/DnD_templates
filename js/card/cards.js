
var Card = React.createClass({
  render: function() {
    var bigNameLength = this.props.data.name.length;
    for (var i = 0; i <bigNameLength; i++) {
      if (~['Ж','Ш','Щ','М','ж','ш','щ','м'].indexOf(this.props.data.name[i])) {
        bigNameLength+=0.5;
      }
    } 
    var bigName = bigNameLength > 26 ? true : false;
    var cardClass = 'card ';
    var font = this.props.data.font || 2;
    var level = this.props.data.level || 'Заговор';
    var selfClass = this.props.data.class || 'Умение';
    var name = this.props.data.name || 'Шаблон';
    var color = this.props.color;
    var style = {"backgroundColor": color};
    var border = {
            "borderBottomColor" : color,
            "borderTopColor" : color,
            "borderRightColor" : color,
            "borderLeftColor" : color,
            "borderColor" : color,
    };
    if (this.props.showBack) {
      cardClass += ' back';
      var lvlNum = level.substr(0,1);
      return (
        <div className={cardClass}>
          <div className='number'>{lvlNum}</div>
          <div className='number2'>{lvlNum}</div>
        </div>
      );
    }
    else {
    if (selfClass=="Умение") return (
      <div className={cardClass + selfClass} style={style}>
        <div className="title"><span className="fs">{name}</span></div>
          <div className="text" style={{"height":"71mm"}}>
            {
              this.props.data.text.map(function(pText, ind) {
              return (
                <p className="txt" key={ind} style={{"fontSize": font + "mm", "lineHeight" : font * 0.9 + "mm"}}>{pText}</p>
              );
              }, this)
            }
          </div>
        <div className="footer">
          {level}
        </div>
      </div>
    );
    else {
      return (
        <div className="card" style={style}>
          <div className="title"><span className="fs">{name}</span></div>
          <div className="level" style={style}>{this.props.data.type}</div>
          <div className="props">
              <div className="prop" style={border}>
                <div className="propName">Время</div>
                <div className="propValue">{this.props.data.time}</div>
              </div>
              <div className="prop" style={border}>
                <div className="propName">Дистанция</div>
                <div className="propValue">{this.props.data.range}</div>
              </div>
              <div className="prop" style={border}>
                <div className="propName">Компоненты</div>
                <div className="propValue">{this.props.data.components}</div>
              </div>
              <div className="prop" style={border}>
                <div className="propName">Длительность</div>
                <div className="propValue">{this.props.data.duration}</div>
              </div>
          </div>
          <CardText text={this.props.data.text} hightlevel={this.props.data.hightlevel} font={font} color={color}/>
          <div className="footer">
            {level}
          </div>
        </div>
        );
      }
    }
  }
});

var CardText = React.createClass({
  render: function() {
    var fontSizeClass = 'text';
    var len = 0;
    var color = this.props.color;
    var font = this.props.font;
    var cardText = this.props.text.map(function(pText, ind) {
      return (
        <p className="txt" key={ind} style={{"fontSize": font + "mm", "lineHeight" : font - 0.3 + "mm"}}>{pText}</p>
      );
    });
    var higherLevels = "";
    if (this.props.hightlevel && this.props.hightlevel.length) {
      higherLevels = (<HigherLevels text={this.props.hightlevel} color={color}/>);
    }
    return (
      <div className={fontSizeClass}>
        <div className="level" style={{"backgroundColor": color}}></div>
        {cardText}
        {higherLevels}
      </div>
    );
  }
});


var HigherLevels = React.createClass({
  render: function() {
    var color = this.props.color;
    return (
      <div className="higherLevels">
        <div className="level" style={{"backgroundColor": color}}>На более высоком уровне</div>
        {
          this.props.text.map(function(pText, ind) {
            return (
              <p className="txt" key={ind}>{pText}</p>
            );
          })
        }
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
        this.cards = JSON.parse(text).cards;
        this.setState({});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  getInitialState: function() {
    return {data: [], showBacks: false};
  },
  componentDidMount: function() {
    this.loadCommentsFromServer();
  },
  render: function() {
    var color = this.props.color;
    return (
        <div className="cards" key="cards">
          {
            this.cards.map(function(card, ind)
              {
              return(<Card data={card} showBack={this.state.showBacks} key={ind} color={color}/>);
              }, this)
          }
        </div>
    );
  }
});


ReactDOM.render(
  <Cards url={document.getElementById("cards_builder").dataset.json} pollInterval={5000} color={document.getElementById("cards_builder").dataset.color} />,
  document.getElementById('content')
);
