mcp.modules.editor.run = function(parent,options)  {
 
	console.log('editor run');
	
	var demo = function() {
		
		var demo = this;	
		
		var name_space = 'editor'; 
		
		var parsed_options = JSON.parse(options) || {};

		// how big the container element is
		var container_size = {};
		
		// base container
		var edtior_iframe = utility.element('iframe', { 'id' : name_space+'-container'});
			
		var editor_document = {};
	
		demo.build = function() {
					
			
			//  inject our container
			parent.appendChild(edtior_iframe);
			
			
			var start = utility.element('p', { "html" : "&nbsp;"});
			 
			editor_document = edtior_iframe.contentWindow.document;
			editor_document.body.appendChild(start)
			editor_document.designMode="on";
			
			
			edtior_iframe.focus()
   
		  
		    var rng = edtior_iframe.contentWindow.document.createRange();
		    rng.setStart(start,1);
		    rng.setEnd(start, 1);
		    
		    var sel = edtior_iframe.contentWindow.getSelection();
		    sel.removeAllRanges();
		    sel.addRange(rng);
    

			
			var iframe_css = document.createElement('link');
			iframe_css.setAttribute("rel", "stylesheet");
			iframe_css.setAttribute("charset", "utf-8");
			iframe_css.setAttribute("type", 'text/css')
			iframe_css.setAttribute('href', 'app/css/pure-editor.css');
	
			// inject to the head
			editor_document.getElementsByTagName("head")[0].appendChild(iframe_css);
			
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
			editor_document.body.addEventListener('click', function(evt){
				
				evt.stopPropagation();
				
				console.log(evt)
				
				if(evt.target.tagName==="BODY") { 
					
					// start with a normal appendChild
					var position = 0;
					
					var target_y = evt.pageY || event.touches[0].pageY;
					var elements = get_element_positions(target_y);
					console.log(elements)
					
					if(elements.next) {
						elements.next.innerHTML = 'next';
						elements.next.classList.add('testfade');
						
						// there is an element before so we need to inject it there
						position = 2;
					}
						
					if(elements.previous) {
						elements.previous.innerHTML = 'previous';
						elements.previous.classList.add('testfade');
					}
					 
					// inject a p tag
					inject_tag(tag_type(9),position, elements);
					
				}	
				
			});
		}
		
		var sizing = function(){
			// get the size of our container
			container_size = edtior_iframe.getBoundingClientRect();
		}
		
		// tag types
		var tag_type = function(type) {
			
			var tag = "p";
			
			switch(type) {
				case 1:
					tag = 'h1';
				break;
				
				case 2:
					tag = 'h2';
				break;
				
				case 3:
					tag = 'h4';
				break;
				
				case 4:
					tag = 'h4';
				break;
				
				case 5:
					tag = 'h5';
				break;
				
				case 6:
					tag = 'h6';
				break;
				
				case 7:
					tag = 'p';
				break;
				
				case 8:
					tag = 'span';
				break;
				
				case 9:
					tag = 'img';
				break;
			}
			
			return tag;
		}
		
		// Inject p tag
		/*	
			@type - see tag_type
			@position - 
				0 - appendChild
				1 - afterend
				2 -  beforebegin
		*/
		var inject_tag = function(type,position,elements) {
			
			// create tag
			var tag = utility.element(tag_type(type), { "class" : "testfade" });
			
			// where to put the elemtn
			if(position===0){
			
				editor_document.body.appendChild(tag)
		
			} else if(position===2){
				
				editor_document.body.insertBefore(tag,elements.next);
			
			}
			
			tag.innerHTML = new Date().getTime();
			
			tag.addEventListener(utility.animation('end'), function() {
				
				tag.classList.remove('testfade');
				
			})
			
			// focus the text area
			tag.contentEditable = true;
			
			//focus the tag
		    var rng = edtior_iframe.contentWindow.document.createRange();
		    rng.setStart(tag, 1);
		    rng.setEnd(tag, 1);
		   
		    var sel = edtior_iframe.contentWindow.getSelection();
		    sel.removeAllRanges();
		    sel.addRange(rng);
		    
	 
			// xhr stuff
			
			// make it available for the calling function
			return tag;
		}
		
		// work out where all the elements on the page are
		var get_element_positions = function(mouse_y) {
			// reset our node containres
			var elements = {
				next: null,
				previous: null,
			}
			
			var child_nodes = editor_document.body.childNodes;
			// loop through the child nodes to get the next element
			for(var a =0, length = child_nodes.length; a<length; a++) {
				
				// we have the next element, 
				if(child_nodes[a].offsetTop >mouse_y && elements.next===null) {
					elements.next = child_nodes[a];
				}
			}
			
			// use the next element to return the previous element 
			// (we do this as working out previous is harder unless we reverse the looops
			if(elements.next && elements.next.previousElementSibling)  {
				elements.previous = elements.next.previousElementSibling;
			}
			
			return elements;
		}
		
		
		return demo;
	}
	
	var instance = demo();
		instance.build();
	

}

 