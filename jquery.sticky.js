/*
 * jQuery sticky
 *
 * Copyright (c) 2011-2014, 2degrees Limited <egoddard@tech.2degreesnetwork.com>.
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

(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(['jquery'], factory);
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {
    'use strict';

    var NON_DEFAULT_FLOW_POSITIONS = ['relative', 'absolute'];

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
                
                self._is_paused = false;

                var $anchor = $('<div />');
                $anchor.css({
                    position: 'static',
                    visibility: 'hidden',
                    height: 0,
                    margin: 0,
                    padding: 0
                });
                $anchor.insertBefore($sticky_elem);

                var args =
                    [$parent_elem, $actual_parent_elem, $anchor, settings];
                $window.bind('resize.sticky, scroll.sticky', function () {
                    self._handle_scroll.apply($sticky_elem, args);
                });
                self._handle_scroll.apply($sticky_elem, args);
            });

        },

        destroy: function () {
            $window.unbind('.sticky');
            $('body').removeClass('sticky');
        },
        
        pause: function () {
            self._is_paused = true;
        },

        resume: function () {
            self._is_paused = false;
        },

        _handle_scroll: function ($parent_elem, $actual_parent_elem, $anchor, settings) {
            var $sticky_elem = $(this);
            if (self._is_paused) {
                self._set_element_to_default_positioning($sticky_elem);
                return true;
            }
            
            var sticky_elem_height = $sticky_elem.outerHeight();

            var is_element_smaller_than_window =
                $window.height() > sticky_elem_height;

            var top_scroll_point = $anchor.offset().top;
            var window_scroll_top = $window.scrollTop();
            var is_element_top_off_screen =
                window_scroll_top >= (top_scroll_point - settings.gutter);

            if (is_element_smaller_than_window && is_element_top_off_screen) {
                // Determine where the bottom of the element will be if we use
                // position fixed, as we don't want it to spill over the bottom
                // of the container
                var sticky_elem_potential_bottom = window_scroll_top +
                    sticky_elem_height;

                var parent_bottom = $parent_elem.offset().top +
                    $parent_elem.outerHeight() - settings.gutter;

                var bounding_width = get_element_bounding_width(
                    $sticky_elem,
                    $actual_parent_elem,
                    settings
                );

                var bottom_cut_off = parent_bottom - settings.gutter;
                if (sticky_elem_potential_bottom >= bottom_cut_off) {
                    if (is_element_removed_from_document_flow($actual_parent_elem)) {
                        parent_bottom -= $parent_elem.offset().top;
                    }
                    $sticky_elem.css({
                        position: 'absolute',
                        top: (parent_bottom - sticky_elem_height) + 'px',
                        width: bounding_width + 'px',
                        left: 'auto'
                    });

                } else {
                    var fixed_left =
                        $anchor.offset().left - $window.scrollLeft();
                    $sticky_elem.css({
                        position: 'fixed',
                        top: settings.gutter + 'px',
                        left: fixed_left + 'px',
                        width: bounding_width + 'px'
                    });
                }
                $('body').addClass('sticky');
            } else {
                self._set_element_to_default_positioning($sticky_elem);
            }
        },
        
        _set_element_to_default_positioning: function ($sticky_elem) {
            $sticky_elem.removeAttr('style');
            $('body').removeClass('sticky');
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
    };

    var is_element_removed_from_document_flow = function ($element) {
        var element_position = $element.css('position');
        return $.inArray(element_position, NON_DEFAULT_FLOW_POSITIONS) !== -1;
    };

    var sum_css_sizes = function ($element, css_propery_names) {
        var sum = 0;
        $.each(css_propery_names, function (index, css_property_name) {
            sum += parseInt($element.css(css_property_name) || 0, 10);
        });
        return sum;
    };

    var get_element_bounding_width = function ($element, $container, settings) {
        var width;
        if (settings.width) {
            width = settings.width;
        } else {
            var element_margin_x = sum_css_sizes(
                $element,
                ['margin-left', 'margin-right']
            );
            var element_border_x = sum_css_sizes(
                $element,
                ['border-left-width', 'border-right-width']
            );

            width = $container.width() - element_margin_x - element_border_x;
        }
        return width;
    };

}));

