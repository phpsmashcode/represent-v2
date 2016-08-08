<?php
/**
 * @version 2.0
 */
/*
Plugin Name: Represent
Plugin URI: https://represent.me/
Description: Plugin developed for https://represent.me/
Author: Hariprasad Vijayan
Version: 2.0
Author URI: http://phpsmashcode.com/
*/

function gavickpro_tc_css()
{
    wp_enqueue_style('gavickpro-tc', plugins_url('/css/style.css', __FILE__));
}
add_action('admin_enqueue_scripts', 'gavickpro_tc_css');
add_action('admin_head', 'gavickpro_add_my_tc_button');
function gavickpro_add_my_tc_button()
{
    global $typenow;
    // check user permissions
    if (!current_user_can('edit_posts') && !current_user_can('edit_pages')) {
        return;
    }
    // verify the post type
    if (!in_array($typenow, array('post', 'page'))) {
        return;
    }
    // check if WYSIWYG is enabled
    if (get_user_option('rich_editing') == 'true') {
        add_filter('mce_external_plugins', 'gavickpro_add_tinymce_plugin');
        add_filter('mce_buttons', 'gavickpro_register_my_tc_button');
    }
}
function gavickpro_add_tinymce_plugin($plugin_array)
{
    $plugin_array['gavickpro_tc_button'] = plugins_url('/js/editor-button.js', __FILE__); // CHANGE THE BUTTON SCRIPT HERE
    return $plugin_array;
}
function gavickpro_register_my_tc_button($buttons)
{
    array_push($buttons, 'gavickpro_tc_button');

    return $buttons;
}

add_action('wp_ajax_rme_shortcode_gen', '__callback__rme_shortcode_gen');
function __callback__rme_shortcode_gen()
{
    die();
}
// Creates short code represent_me
add_shortcode('represent_me', '__represent_me_sc');
// Shortcode call back function
function __represent_me_sc($atts)
{
	if(!empty($atts["id"]) && !empty($atts["slug"]))
	{
		//$html = '<iframe src="https://represent.cc/'.$atts["id"].'/'.$data_flow.'" allowfullscreen style="border:0; width:100%; height: 600px;"></iframe>';
		$html = '<iframe src="https://represent.me/'.$atts["id"].'/'.$atts["slug"].'/" allowfullscreen style="border:0; width:100%; height: 600px;"></iframe>';
	}
	return $html;
}
add_action('wp_ajax_rme_searchapi', '__callback__rme_searchapi');
function __callback__rme_searchapi()
{
    if ($_POST) {
        $rme_question = $_POST['txt__rme_keyword'];
				$url = 'https://represent.me/api/questions/?format=json&ordering=-direct_vote_count&search='.$rme_question;
				$request  = wp_remote_get( $url );
				$response = wp_remote_retrieve_body( $request );
				if (
				    'OK' !== wp_remote_retrieve_response_message( $response )
				    OR 200 !== wp_remote_retrieve_response_code( $response )
				)
				    wp_send_json_error( $response );
				wp_send_json_success( $response );
    }
}
