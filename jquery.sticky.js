/*
 * jQuery sticky
 *
 * Copyright (c) 2011, 2degrees Limited <egoddard@tech.2degreesnetwork.com>.
 * All Rights Reserved.
 *
 * This file is part of jquery.select2autocomplete
 * <https://github.com/2degrees/jquery.sticky>, which is subject to
 * the provisions of the BSD at
 * <http://dev.2degreesnetwork.com/p/2degrees-license.html>. A copy of the
 * license should accompany this distribution. THIS SOFTWARE IS PROVIDED "AS IS"
 * AND ANY AND ALL EXPRESS OR IMPLIED WARRANTIES ARE DISCLAIMED, INCLUDING, BUT
 * NOT LIMITED TO, THE IMPLIED WARRANTIES OF TITLE, MERCHANTABILITY, AGAINST
 * INFRINGEMENT, AND FITNESS FOR A PARTICULAR PURPOSE.
 *
 * Depends:
 * jQuery 1.6+
 */

(function ($) {
    var $window = $(window);
    var self = {
        init: function (options) {
            var settings = {
                parent: null,
                width: null,
                gutter: 0
            };
            
            return this.each(function () {
                var $sticky_elem = $(this);
                
                $.extend(settings, options);
                
                if (settings.parent) {
                    var $parent_elem = $(settings.parent);
                    var $actual_parent_elem = $sticky_elem.parent();
                } else {
                    var $parent_elem = $sticky_elem.parent();
                    var $actual_parent_elem = $parent_elem;
                }
                
                $window.bind('resize.sticky, scroll.sticky', function () {
                    self._handle_scroll.apply(
                        $sticky_elem, [$parent_elem, $actual_parent_elem, settings]);
                });
                self._handle_scroll.apply(
                    $sticky_elem, [$parent_elem, $actual_parent_elem, settings]);
            });
            
        },
        destroy: function () {
            $window.unbind('.sticky');
        },
        _handle_scroll: function ($parent_elem, $actual_parent_elem, settings) {
            // Compute parameters needed for the sticky element
            var $sticky_elem = $(this);
            var sticky_elem_margin_x = parseInt($sticky_elem.css('margin-left')) +
                parseInt($sticky_elem.css('margin-right'));
            var sticky_elem_border_x = parseInt($sticky_elem.css('border-left-width')) +
                parseInt($sticky_elem.css('border-right-width'));
            var sticky_elem_height = $sticky_elem.outerHeight();
            
            // Try to use the previous sibling to reference the top point
            var $top_elem = $sticky_elem.prev();
            
            // If there is no previous element, fall back to the parent
            if ($top_elem.length) {
                var top_scroll_point = $top_elem.offset().top + $top_elem.height();
            } else {
                $top_elem = $parent_elem;
                var top_scroll_point = $top_elem.offset().top;
            }
            
            // Decide which display mode sticky element needs to be in
            var window_scroll_top = $window.scrollTop();
            if ($window.height() > sticky_elem_height &&
                window_scroll_top >= (top_scroll_point - settings.gutter)) {
                // Determine where the bottom of the element will be if we use
                // position fixed, as we don't want it to spill over the bottom
                // of the container
                var sticky_elem_potential_bottom = window_scroll_top +
                    sticky_elem_height;
                var parent_bottom = $parent_elem.offset().top +
                    $parent_elem.outerHeight() - settings.gutter;
                var fixed_width = settings.width || (
                    $actual_parent_elem.width() -
                    sticky_elem_margin_x -
                    sticky_elem_border_x
                    );
                
                if (sticky_elem_potential_bottom >= (parent_bottom - settings.gutter)) {
                    $sticky_elem.css({
                        position: 'absolute',
                        top: parent_bottom - sticky_elem_height,
                        width: fixed_width
                        });
                    
                } else {
                    $sticky_elem.css({
                        position: 'fixed',
                        top: settings.gutter + 'px',
                        width: fixed_width});
                }
                
            } else {
                $sticky_elem.css({position: '', top: ''});
            }
        }
    };
    
    $.fn.sticky = function (method) {
        if (self[method] && method.substr(0, 1) !== '_') {
            return self[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return self.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.sticky');
        } 
    }
})(jQuery);