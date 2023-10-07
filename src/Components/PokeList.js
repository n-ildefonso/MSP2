class App extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = { resources:[], pageSize:this.props.perPage||9, pageNo:0, prevY:0, loading:false, loadedOnce:false};
        this.fetchData = this.fetchData.bind(this);
        this.fetchDetails = this.fetchDetails.bind(this);
        this.handleObserver = this.handleObserver.bind(this);
    }
    
    async componentDidMount() {
        
        // load more on page 
        var options = {
          root: null,
          rootMargin: "20px",
          threshold: 1
        };
        
        // observer
        this.observer = new IntersectionObserver(
          this.handleObserver.bind(this),
          options
        );
        
        // observe the `loadingRef`
        this.observer.observe(this.loadingRef);
    }
    
    
    getPagedListView(){
        if (this.state.PageNo===0) {
            return new Request('https://pokeapi.co/api/v2/pokemon/?limit='+this.state.pageSize, {
                method: 'get'
            }); 
        }
        else {
            return new Request('https://pokeapi.co/api/v2/pokemon/?offset='+(this.state.pageNo+this.state.pageSize)+'&limit='+this.state.pageSize, {
                method: 'get'
            });   
        }
    }
    
    getDetailsView(id){
        console.log(id)
      return new Request('https://pokeapi.co/api/v2/pokemon/'+id, {
        method: 'get'
      });
    }
    
    async fetchData() {
        var _self = this;
        this.setState({ loading: true });
        
        var resp = await fetch(this.getPagedListView()).catch(err => {console.log(err)});
        if(resp.status >= 200 && resp.status < 300) {
            var json = await resp.json();
            const resources = json.results;
            
            // append the new items and update state
            this.setState({
                loading: false, 
                pageNo: this.state.pageNo+1, 
                resources: [...this.state.resources, ...resources]
            },function(){
                var all = this.state.resources;
                for (var r in all) {
                    //poke id is index+1
                    var item = all[r];
                    console.log(item);
                    if (!item.details) {
                        this.fetchDetails(parseInt(r)+1); 
                    }
                }
            })
        }
    }
    
    async fetchDetails(id) {
        var _self = this;
        console.log(id);
        const items = this.state.resources;
        var resp = await fetch(this.getDetailsView(id)).catch(err => {console.log(err)});
        if(resp.status >= 200 && resp.status < 300) {
            var json = await resp.json();
            const resource = json;
            
            //console.log(resource);
            
            if (items[id]) {
                items[id].id = id;
                items[id].details = resource;
            }
        
            // re-render
            this.forceUpdate();
        }
    }
    
    handleObserver(entities, observer) {
        const y = entities[0].boundingClientRect.y;
        const top = entities[0].target.getBoundingClientRect().top;
    
        if (entities[0].intersectionRatio > 0) {
            // append more data
            this.fetchData();
            
            // in case loading element top is less than viewport height
            if (top < window.innerHeight && !this.state.loadedOnce) {
                observer.unobserve(this.loadingRef);
                observer.observe(this.loadingRef);
                this.setState({loadedOnce:true});
            }
            //this.setState({pageNo: this.state.pageNo+1, prevY:y});
            this.setState({prevY:y});
        }

    }
    
    render(){
        const loadingTextCSS = { display: this.state.loading ? "block" : "" };
        var {resources} = this.state;
        return(
        <div>
            <div className="row">
                <div className="col-12">
                    <h4>Bootstrap 4 React Infinite Scrolling Pokemon API</h4>
                </div>
            </div>
            <div className="row" id="scrollRoot">
                {resources && resources.length > 0 ? resources
                .map((resource,key) =>
                (
                <div className={'py-3 animated fadeIn ' + (this.props.colSize?this.props.colSize:'col-md-4')} key={key}>
                    <div className="card">
                        <div className="card-body">
                            <img className="rounded-circle float-right" 
                            src={resource.url.replace('https://pokeapi.co/api/v2/pokemon/','https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/').slice(0, -1)+'.png'} />
                            <h5><a href={resource.url} target="new">{resource.name}</a> {resource.id}</h5>
                            
                            {
                                resource.details && resource.details.forms?resource.details.forms.map((form,k) =>(
                                <div key={k}>
                                    {form.name}
                                </div>)):<span>...</span>
                            }
                            
                            {
                                resource.details?
                                <div>
                                    <div>Weight: {resource.details.weight}</div>
                                    <div>Moves: {resource.details.moves.length}</div>
                                    <div>Abilities: {resource.details.abilities.length}</div>
                                </div>:null
                            }
                        </div>
                    </div>
                </div>
                )):<div />}
            </div>
            <div className="row">
                <div className="col-12 mt-5 py-5 text-center" ref={loadingRef => (this.loadingRef = loadingRef)}>
                  <span style={loadingTextCSS}>
                    ...loading...
                  </span>
                </div>
            </div>
        </div>
        )
    }
};

// render
ReactDOM.render(
  <App />,
  document.getElementById("app")
);