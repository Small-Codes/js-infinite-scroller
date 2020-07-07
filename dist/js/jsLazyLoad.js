/**
 * Plugin Name      : JS Infinite Scroller
 * Plugin Version   : 1.0.0
 * Plugin Author    : irahulsaini.com
 * Plugin URL       : https://github.com/small-plugins/js-infinite-scroller
**/
(function( $ ){
   $.fn.jsLazyLoad = function(options,cb) {
        var jsll_items = [], 
        start = 0, 
        loaded = 0, 
        jsll = this, 
        autoload = 0, 
        $btn, $loading;

        //add some required css into head before processing data
        $('head').append('<style type="text/css" id="jsLazyLoad_css">.jsll,.jsll .jsll-loading{display:none;}.jsll .jsll-lmb{opacity:0}.jsll .jsll-btn-show{opacity:1}.jsll-item{transition:.3s;transform:scale(0);height:0;width:0;}.jsll-item.jsll-item-show{transform:scale(1);height:auto;width:auto;}</style>');

        //get all items into object and remove HTML DOM
        $('.jsll-item',jsll).each(function(i,v){
            jsll_items.push(v);
            $(v).remove();
        });

        //Default Settings
        var settings = $.extend({
            autoload: false, //required jQuery Appear Plugin
            stop_autoload: false, //required jQuery Appear Plugin
            completed_text:'', //display when all items displayed
            per_page: 10, //per page items
            jsll_items_class:'', 
            button_class: '',
            button_text:'Load More',
            loading_class:'',
            loading_text:'Loading...',
            button_loading_text:'Loading...',
            delay:.01,
        }, options );
        
        $(document).on('click','#'+$(jsll).attr('id')+' .jsll-lmb',function(e){
            e.preventDefault();
            display_items();
        })
        

        function display_items(){
            if(start < jsll_items.length){
                if(start == 0){
                    //prepare dom
                    $(jsll).html('<div class="jsll-items '+settings.jsll_items_class+'"></div>');
                    if(settings.autoload == true){
                        $(jsll).append('<div class="jsll-viewport" style="width:100%;height:1px"></div>');
                    }
                    $(jsll).append('<div class="jsll-loading '+settings.loading_class+'">'+settings.loading_text+'</div>');
                    $(jsll).append('<button type="button" class="jsll-lmb '+settings.button_class+'">'+settings.button_text+'</button>');
                    $(jsll).fadeIn();
                }
                _status(true);
                var count = start;
                settings.per_page = parseInt(settings.per_page);
                for(i=start;i<(count+settings.per_page);i++){
                    if(start >= jsll_items.length){
                        break;
                    }
                    $('.jsll-items',jsll).append(jsll_items[i]);
                    start++;
                }

                setTimeout(function(){                    
                    $('.jsll-item',jsll).addClass('jsll-item-show');
                    //$btn.removeAttr('disabled').html(settings.button_text);
                    autoload++;
                    if(start >= jsll_items.length){
                        _complete()
                    }else{
                        _status();
                    }
                },(settings.delay*1000));
            }else{
                _complete();    
            }
            _complete();
        }
        display_items(); 
        
        if(settings.autoload == true){
            $.appear('.jsll-viewport',jsll);
            $('.jsll-viewport',jsll).on('appear', function(event) {
                if(settings.autoload == true && !settings.stop_autoload){
                    display_items();
                    return;
                }
                if(autoload < settings.stop_autoload && start < jsll_items.length){
                    display_items();
                    $btn.addClass('jsll-btn-show');
                }

            });
        }
        function _status(loading){
            $loading = $('.jsll-loading',jsll);
            $btn = $('.jsll-lmb',jsll);
            if(loading == true){
                if(settings.stop_autoload > 1 && autoload >= settings.stop_autoload && start < jsll_items.length){
                    $btn.addClass('jsll-btn-show');
                    return;
                }
                if(settings.autoload == true && settings.stop_autoload > 1 && autoload >= settings.stop_autoload){
                    $btn.remove();
                }
                if(settings.autoload == false || !settings.autoload){
                    $btn.removeClass('jsll-btn-show');
                    $loading.html(settings.loading_text).fadeIn();

                    return;
                }
                
            }
            $btn.removeAttr('disabled').html(settings.button_text).addClass('jsll-btn-show');;
            $loading.fadeOut(1);
            if(autoload >= settings.stop_autoload && start < jsll_items.length){
                return;
            }
            
        }
        function _complete(){
            if(start >= jsll_items.length){
                if(settings.completed_text){
                    $loading.html(settings.completed_text);
                    $loading.fadeIn();
                    $btn.removeClass('jsll-btn-show').remove();
                    return;
                }
                $loading.fadeOut().remove();
                $btn.removeClass('jsll-btn-show').remove();
            }
        }
        return this;
        //return true;
   };
   
})( jQuery );