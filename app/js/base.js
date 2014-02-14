mcp.modules.editor.run = function(parent,options)  {
 
	console.log('editor run');
	
	var demo = function() {
		
		var demo = this;	
		
		var name_space = 'editor'; 
		
		var parsed_options = JSON.parse(options) || {};

		// how big the container element is
		var container_size = {};
		
		// base container
		var container = utility.element('iframe', { 'id' : name_space+'-container'});
		
	
		demo.build = function() {
					
			
			//  inject our container
			parent.appendChild(container);
			
			
			var start = utility.element('p', { });
			container.contentWindow.document.body.appendChild(start)
			container.contentWindow.document.designMode="on";
	
			
			var iframe_css = document.createElement('link');
			iframe_css.setAttribute("rel", "stylesheet");
			iframe_css.setAttribute("charset", "utf-8");
			iframe_css.setAttribute("type", 'text/css')
			iframe_css.setAttribute('href', 'app/css/base.css');
	
		// inject to the head
		container.contentWindow.document.getElementsByTagName("head")[0].appendChild(iframe_css);
			
			//container.setAttribute("contenteditable",true);
			
			/*
				Example specific code
			*/
		 
			/* 
				Default funcitons
			*/
			// events
			events();
			
			// size the page
			sizing();
			
			/// observe, all of the time
			window.addEventListener('resize', _.debounce(sizing,150));
			
		}
		
		var events = function(){
			
			
			// click events		
			parent.addEventListener('click', function(evt){
				
			
			});
			
			/* custom events */
			container.addEventListener('click', function(evt){
			
			});
		}
		
		var sizing = function(){
		
		
			// get the size of our container
			container_size = container.getBoundingClientRect();
			
		}
		
		
		return demo;
	}
	
	var instance = demo();
		instance.build();
	

}
