(function() {
    tinymce.PluginManager.add('gavickpro_tc_button', function(editor, url) {
        editor.addButton('gavickpro_tc_button', {
            title: 'represent.me Shortcode Gen.',
            icon: true,
            icon: 'icon  gavickpro-own-icon', //dashicons-share-alt2 gavickpro-own-icon
            onclick: function() {
                var win = editor.windowManager.open({
                    title: 'Represent Shortcode Gen.',
                    width: 800,
                    height: 100,
                    body: [{
                        type: 'textbox',
                        id: 'txt__rme_keyword',
                        name: 'txt__rme_keyword',
                        label: 'keyword',
                        tooltip: 'Type your keyword',
                        onKeyUp: function() {
                            if (jQuery('#txt__rme_keyword').val().length > 3) {
                                var txt__rme_keyword = jQuery('#txt__rme_keyword').val();
                                jQuery.post(
                                    ajaxurl, {
                                        'action': 'rme_searchapi',
                                        'txt__rme_keyword': txt__rme_keyword,
                                    },
                                    function(response) {
                                      if(response.data != '')
                                      {
                                          response = JSON.parse(response.data);
                                          if(response.count > 0)
                                          {
                                            var questions = response.results;
                      											var suggestion = '<ul width="400px">';
                      											jQuery(questions).each(function(i, e) {
                      												suggestion = suggestion + '<li id="'+e.slug+'" class="" onclick="callback__search_api_result_click(this.innerHTML, this.id, '+e.id+')">' + e.question +'</li>';
                                            });
                      											suggestion = suggestion + '</ul>';
                      											jQuery('#rme_search_result').html(suggestion);
                                          }
                                      }
                                    }
                                );

                            }
                        }
                    }, {
                        type: 'container',
                        name: 'container',
                        label: ' ',
                        html: '<div height="auto" width="275px" style="background-color: white; z-index: 9999999;" id="rme_search_result"></div>',
                        multiline: true,
                        style: 'height: auto; width:275px;',
                    }, {
                        type: 'container',
                        name: 'container',
                        label: ' ',
                        html: '<small id="pmc_notification" style="font-size:10px; font-style:italic; color:red;"></small>',
                        style: 'height: 15px',
                    }, {
                        type: 'label',
                        id: 'lbl__rme_status',
                        multiline: true,
                        style: 'height: 50px',
                        text: ""
                    }],
                    onsubmit: function(e) {
                        if (e.data.txt__rme_keyword === '') {
                            jQuery('#txt__rme_keyword').css('border-color', 'red');
                            return false;
                        } else {
                            var window_id = this._id;
                            var var_ques = e.data.txt__rme_keyword;
                            var keyword_id = jQuery('#txt__rme_keyword').attr('data-id');
                            var keyword_title = jQuery('#txt__rme_keyword').attr('data-title');
                            if (keyword_id && keyword_title && var_ques) {
                                var shortcode = '[represent_me question="' + var_ques + '"';
                                    shortcode = shortcode + ' id="' + keyword_id + '"';
                                    shortcode = shortcode + ' slug="' + keyword_title + '"';
                                    shortcode = shortcode + ']';

                                editor.insertContent(shortcode);
                                editor.windowManager.close();
                            } else {
                              document.getElementById("pmc_notification").innerHTML = 'Please pick one question.';
                            }
                            return false;
                        }
                    },
                    onclick: function() {
                        document.getElementById("rme_search_result").innerHTML = '';
                        document.getElementById("pmc_notification").innerHTML = '';
                    }
                });
            }
        });
    });
})();
function callback__search_api_result_click(value, slug, id)
{
	document.getElementById("txt__rme_keyword").value = value;
	document.getElementById("txt__rme_keyword").setAttribute('data-title',slug);
	document.getElementById("txt__rme_keyword").setAttribute('data-id',id);
  var shortcode = '[represent_me question="' + value + '"';
      shortcode = shortcode + ' id="' + id + '"';
      shortcode = shortcode + ' slug="' + slug + '"';
      shortcode = shortcode + ']';
	//document.getElementById("rme_search_result").innerHTML = shortcode;
  tinyMCE.activeEditor.insertContent(shortcode);
  tinyMCE.activeEditor.windowManager.close();
}
