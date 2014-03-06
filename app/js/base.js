mcp.modules.editor.run = function(parent,options)  {
 
	console.log('editor run');
	
	var demo = function() {
		
		var demo = this;	
		
		var name_space = 'editor'; 
		
		var parsed_options = JSON.parse(options) || {};

		// how big the container element is
		var container_size = {};
		
		// base container
		var editor_canvas = utility.element('div', { 'id' : name_space+'-container'});
			 
	
		demo.build = function() {
					
			
			//  inject our container
			parent.appendChild(editor_canvas);
			
			
			//editor_document = editor_canvas.contentWindow.document;
		//	editor_document.designMode="on";
					  
		
			var iframe_css = document.createElement('link');
			iframe_css.setAttribute("rel", "stylesheet");
			iframe_css.setAttribute("charset", "utf-8");
			iframe_css.setAttribute("type", 'text/css')
			iframe_css.setAttribute('href', 'app/css/pure-editor.css');

			// inject to the head
			document.getElementsByTagName("head")[0].appendChild(iframe_css);
			 
			
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
			
			
			 
			/* custom events */
			editor_canvas.addEventListener('click', function(evt){
				
				evt.stopPropagation();
				
				
				if(evt.target.id===name_space+'-container') { 
					
					// start with a normal appendChild
					var position = 0;
					
					var target_y = evt.pageY || event.touches[0].pageY;
					var elements = get_element_positions(target_y);
					
					if(elements.next) {
						
						// there is an element before so we need to inject it there
						position = 2;
					}
					 
					// inject a p tag
					inject_contextual_editor_bar(position, elements);
					
				}	
				
			});
			
			// is shift down?
			var shift = false;
			
			
			
			// events for making sure our return and backspace work
			editor_canvas.addEventListener('keydown', function(evt){
				
				var current_element = evt.target;
				
				// shift is being held -- probably
				if(evt.keyCode===16) shift = true;
				
				// return 
				if(shift != true && evt.keyCode === 13 && current_element.classList.contains('content-wrapper')) {
					
					// if it is return, clone this element
					evt.preventDefault();
					
					// text to take with the return
					 var selection = current_element.innerHTML.substr(window.getSelection().baseOffset,current_element.innerHTML.length);
				 	  
					 current_element.innerHTML = current_element.innerHTML.substr(0,window.getSelection().baseOffset);
					
					// insert a new tag based on the properties of the previous one
					var tag = inject_tag(current_element.data.type);
					editor_canvas.insertBefore(tag,current_element.nextSibling);
					
					//focus the tag
					tag.innerHTML = selection;
					
					var rng = document.createRange();
				    rng.setStart(tag, 0);
				    rng.setEnd(tag, 0);
					
					var sel = window.getSelection();
				    sel.removeAllRanges();
				    sel.addRange(rng);
				    
				}
				
				
				
				// backspace 
				if(evt.keyCode === 8 && evt.target.classList.contains('content-wrapper')) {
					
					
					/*
					if we are at the start of the string and the user hits backspace
					take the content and move it to the the previous element
					if there is one that is
					*/
					
					var previous_sibling = current_element.previousSibling;
					
					if(window.getSelection().baseOffset===0 && previous_sibling.classList.contains('text') && previous_sibling !== null) {
						
						evt.preventDefault();
					
						var text = current_element.innerHTML;
						
						previous_sibling.insertAdjacentHTML("beforeend",text);
						
						var rng = document.createRange();
					    rng.setStart(previous_sibling, 1);
					 
						var sel = window.getSelection();
					    sel.removeAllRanges();
					    sel.addRange(rng);
					    
						remove_content(current_element);
					}
					
				}
			});
			
			// need an exception if shift is being pressed
			editor_canvas.addEventListener('keyup', function(evt){ 
				shift = false;
			});
			
		}
		
		var sizing = function(){
			// get the size of our container
			container_size = editor_canvas.getBoundingClientRect();
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
					tag = 'media-img';
				break;
			
				case 10:
					tag = 'media-video';
				break;
				// container
				case 11:
					tag = 'container';
				break;
			}
			
			return tag;
		}
		
		var inject_contextual_editor_bar = function(position,elements) {
			
			// create the bar
			var bar = utility.element("div", { "class" : "editor-bar new-element-fade" });
			// where to put the element
			if(position===0){
			
				editor_canvas.appendChild(bar)
		
			} else if(position===2){
				editor_canvas.insertBefore(bar,elements.next);
			}
			
		
			// remove the fade 
			bar.addEventListener(utility.animation('end'), function() {
				
				bar.classList.remove('new-element-fade');
				
			});
			
			// Menu options for the bar
			var options = [
				{
					"name" : "Heading",
					"variants" : [
						{
							"id" : 1,
							"type" : "h1"
						},
						{
							"id" : 2,
							"type" : "h2"
						},
						{
							"id" : 3,
							"type" : "h3"
						},
						{
							"id" : 4,
							"type" : "h4"
						},
						{
							"id" : 5,
							"type" : "h5"
						},
	
						{
							"id" : 6,
							"type" : "h6"
						}
					]
				},
				{
					"name" : "Paragraph",
					"id" : 7,
					"type" : "p"
				},
				{
					"name" : "Media",
					"variants" : [
						{
							"id" : 9,
							"type" : "img"
						},
						{
							"id" : 10,
							"type" : "video"
						}
					]
				},
				{
					"name" : "Container",
					"id" : 11,
					"type" : "container"
				}
			];
			
			// inject our menu
			for(var a = 0, length = options.length; a< length; a++) {
				
				var item = options[a];
				
				var menu_item = utility.element("div", { "class" : "menu-option" + (item.variants ? " variants " : "") , "html" : item.name });
				
				
				// bind data to the item
				menu_item.data = {};
				if(item.id) menu_item.data['id'] = item.id;
				if(item.type) menu_item.data['type'] = item.type;
				
				bar.appendChild(menu_item);
				
				// item has variants so add them
				if(item.variants) {
					
					var item_variants = utility.element("div", { "class" : "menu-variants"});
					menu_item.appendChild(item_variants);
					
					// add sub menu items
					for(var b = 0, b_length = item.variants.length; b< b_length; b++) {
				
						// cache the options
						var variant = item.variants[b];
						
						// inject the element
						var variant_item = utility.element("div", { "class" : "menu-option", "html" : variant.type });
						
						// bind data to the item
						variant_item.data = {};
						variant_item.data['id'] = variant.id;
						variant_item.data['type'] = variant.type;
						
						// append to the pop up menu
						item_variants.appendChild(variant_item);
					}

				}
			}
		
	
			// Events for menu
			bar.addEventListener("click", function(evt){
				
				
				utility.event_delegate(evt, "menu-option", function() {
				
					var element = evt.target;
					
					// hide any menus that maybe open
					var other_menus = bar.querySelectorAll('.menu-variants');
					
					_.each(other_menus, function(item){
						item.classList.remove('show');
					});
					
					// is a pop up
					if(element.classList.contains('variants')) {
						
						var menu = evt.target.querySelector('.menu-variants');
							menu.classList.add('show');
					} 
					
					// is a tag injection
					if(element.data.id && element.data.type) {
						
					
						var tag = inject_tag(element.data.id);
						editor_canvas.insertBefore(tag,bar);
						
						//focus the tag
						tag.innerHTML = " ";
						
					    var rng = document.createRange();
					    rng.setStart(tag, 1);
					    rng.setEnd(tag, 1);
						var sel = window.getSelection();
					    sel.removeAllRanges();
					    sel.addRange(rng);
						
						// remove the bar
						bar.parentNode.removeChild(bar)
					}
					
				});
			
			});
			
			
		}
		
		
		// inject a container
		var inject_container = function() {
			
		}
		
		// Inject p tag
		/*	
			@type - see tag_type
			@position - 
				0 - appendChild
				1 - afterend
				2 -  beforebegin
		*/
		var inject_tag = function(type) {

			// create tag
			var tag = utility.element("div", { "class" : "content-wrapper "+ tag_type(type) + "-tag " + " new-element-fade" });
			
			
			tag.data = {};
			tag.data.type = type;
			
			tag.addEventListener(utility.animation('end'), function() {

				tag.classList.remove('new-element-fade');

			});
			
			// if it is a rich asset tag, don't make it editable
			if(type=== 9 || type=== 10 || type=== 11) {
				
				// if its an image or video show that
				
				// if its a container, well new stuff
				
			} else {
				// it is text so you can edit it
				tag.contentEditable = true;
				
				// text class is used so we know when editing, we input text, particularly around backspace
				tag.classList.add('text');
			}
					
			// xhr stuff

			// make it available for the calling function
			return tag;
		}
		
		
		
		// removes an element
		var remove_content = function(element){ 
		
			// xhr stuff
			element.parentNode.removeChild(element);
		} 
		
		
		// work out where all the elements on the page are
		var get_element_positions = function(mouse_y) {
			// reset our node containres
			var elements = {
				next: null,
				previous: null,
			}
			
			var child_nodes = editor_canvas.childNodes;
			
			// loop through the child nodes to get the next element
			for(var a =0, length = child_nodes.length; a<length; a++) {
				
				// we have the next element, 
				if(child_nodes[a].getBoundingClientRect().top > mouse_y && elements.next===null) {
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

 