
var Card = React.createClass({
  render: function() {
    var typeClassIndex = {
      "Волшебник": "cardArcane",
      "Колдун": "cardKoldun",
      "Чародей": "cardSorserer",
      "Следопыт": "cardRanger",
      "Жрец": "cardCleric",
      "Жрец Бури" : "cardCleric",
      "Жрец Войны":"cardCleric",
      "Жрец Жизни":"cardCleric",
      "Жрец Знания":"cardCleric",
      "Жрец Обмана":"cardCleric",
      "Жрец Природы":"cardCleric",
      "Жрец Света":"cardCleric",
      "Друид": "cardDruid",
      "Паладин": "cardPaladin",
      "Бард": "cardBard"
    };
    var typeClass = typeClassIndex[this.props.type];
    var bigNameLength = this.props.data.name.length;
    for (var i = 0; i <bigNameLength; i++) {
      if (~['Ж','Ш','Щ','М','ж','ш','щ','м'].indexOf(this.props.data.name[i])) {
        bigNameLength+=0.5;
      }
    } 
    var bigName = bigNameLength > 26 ? true : false;
    var cardClass = 'card ' + typeClass
    if (this.props.showBack) {
      cardClass += ' back';
      var lvlNum = this.props.data.level == 'Заговор' ? 0 : this.props.data.level.substr(0,1);
      return (
        <div className={cardClass}>
          <div className='number'>{lvlNum}</div>
          <div className='number2'>{lvlNum}</div>
        </div>
      );
    }
    else if (this.props.data.level == "Дикий облик") return (
      <div className={cardClass}>
        <div className="title"><span className="fs">{this.props.data.name}</span></div>
        <WildCard text={this.props.data.text} bigName={bigName}/>
        <div className="footer">
          {this.props.data.level}
        </div>
      </div>
    );
    else return (
      <div className={cardClass}>
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
        <CardText text={this.props.data.text} hightlevel={this.props.data.hightlevel} bigName={bigName}/>
        <div className="footer">
          {this.props.data.level}
        </div>
      </div>
    );
  }
});

var WildCard = React.createClass({
  render: function() {
    var fontSizeClass = 'textWild';
    var cardText = this.props.text.map(function(pText, ind) {
      var pClass = ind == 0 ? "first" : "";
      return (
        <p className={pClass}>{pText}</p>
      );
    });
    return (
      <div className={fontSizeClass}>
        <div className="level"></div>
        {cardText}
      </div>
    );
  }
});

var CardText = React.createClass({
  render: function() {
    var fontSizeClass = 'text';
    var len = 0;
    this.props.text.forEach(function(pText, ind) {
      len += pText.length;
    })

    if (this.props.bigName) {
      if (len > 900) {
        if (len > 1000) {
          fontSizeClass += ' small';
        }
        else {
          fontSizeClass += ' preSmall'
        }
      }
    } else {
      // if (len > 1150) {
        if (len > 1250) {
          fontSizeClass += ' small';
        }
        else {
          // fontSizeClass += ' preSmall'
        }
      // }
    }

    // if ((len > 1000 && this.props.bigName) || len > 1250) {
    //     fontSizeClass += ' small';
    // }
    if (this.props.bigName) {
      fontSizeClass += ' bigName';
    }

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
  classesCard : {},
  cards : [],
  loadCommentsFromServer: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'text',
      cache: false,
      success: function(data) {
        var text = data.replace(/\r\n/g,' ')
        var arr = JSON.parse(text);
        this.classesCard = arr.classesCard;
        this.cards = arr.cards;
        this.setState({selectedClass: 'Все'});
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
    // setInterval(this.loadCommentsFromServer, this.props.pollInterval);
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
    var cardNodes = '';
    if (this.state.selectedClass == 'Все') {
      cardNodes = this.cards.map(function(card) {
        return (
          <Card data={card} type={this.state.selectedClass} showBack={this.state.showBacks}/>
          );
        }, this);
    } else {
      var arr = [];
      this.cards.forEach(function(card) {
        var lvlNum = card.level == 'Заговор' ? 0 : card.level.substr(0,1);
        var lvlName = 'lvl' + lvlNum;
        if (this.state[lvlName] && ~this.classesCard[this.state.selectedClass].indexOf(card.name )) {
          arr.push(card)
        } 
        else {
        }
      }, this)

      arr.sort(function(self) {
        return function(a,b) {
          return self.classesCard[self.state.selectedClass].indexOf(a.name) - self.classesCard[self.state.selectedClass].indexOf(b.name) ;
        }
      }(this))

      
      if (this.state.showBacks) {
        var tempArr = [];
        while (arr.length) {
          var slice = arr.splice(0,3);
          for (var i = slice.length - 1; i >= 0; i--) {
            tempArr.push(slice[i])
          }
        }
        arr = tempArr;
      console.log(this.state.showBacks)
      }
      cardNodes = arr.map(function(card) {
        return (
          <Card data={card} type={this.state.selectedClass} showBack={this.state.showBacks}/>
          );
        }, this);
    }
    // var classType = {""}[this.state.type]

    return (
        <div className="cards" >
          {cardNodes}
        </div>
    );
  }
});


ReactDOM.render(
  <Cards url="api/sveta.json" pollInterval={5000} type="Монах"/>,
  document.getElementById('content')
);