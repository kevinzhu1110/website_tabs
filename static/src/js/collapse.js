odoo.define('snippet_tab_options', function(require) {
    'use strict';

   var options = require('web_editor.snippets.options');

    options.registry.snippet_testimonial_options = options.Class.extend({
        start: function () {
            var self = this;

            this._super();
            this.$target.on('shown.bs.collapse hidden.bs.collapse', '[role="tabpanel"]', function () {self.buildingBlock.cover_target(self.$overlay, self.$target);});
            this.$el.find(".js_add").on("click", _.bind(this._add_new_tab, this));
            this.$el.find(".js_remove").on("click", _.bind(this._remove_current_tab, this));
        },
        create_ids: function ($target) {
            var time = new Date().getTime();
            var $tab = $target.find('[data-toggle="collapse"]');
    
            // link to the parent group
    
            var $tablist = $target.closest('.panel-group');
            var tablist_id = $tablist.attr("id");
            if (!tablist_id) {
                tablist_id = "myCollapse" + time;
                $tablist.attr("id", tablist_id);
            }
            $tab.attr('data-parent', "#"+tablist_id);
            $tab.data('parent', "#"+tablist_id);
    
            // link to the collapse
    
            var $panel = $target.find('.panel-collapse');
            var panel_id = $panel.attr("id");
            if (!panel_id) {
                while($('#'+(panel_id = "myCollapseTab" + time)).length) {
                    time++;
                }
                $panel.attr("id", panel_id);
            }
            $tab.attr('data-target', "#"+panel_id);
            $tab.data('target', "#"+panel_id);
        },
        drop_and_build_snippet: function () {
            this._super();
            this.create_ids(this.$target);
        },
        on_clone: function ($clone) {
            this._super.apply(this, arguments);
            $clone.find('[data-toggle="collapse"]').removeAttr('data-target').removeData('target');
            $clone.find('.panel-collapse').removeAttr('id');
            this.create_ids($clone);
        },
        on_move: function () {
            this._super();
            this.create_ids(this.$target);
            var $panel = this.$target.find('.panel-collapse').removeData('bs.collapse');
            if ($panel.attr('aria-expanded') === 'true') {
                $panel.closest('.panel-group').find('.panel-collapse[aria-expanded="true"]')
                    .filter(function () {return this !== $panel[0];})
                    .collapse('hide')
                    .one('hidden.bs.collapse', function () {
                        $panel.trigger('shown.bs.collapse');
                    });
            }
        },

        _add_new_tab: function() {
            var self = this;
            var panel_group = self.$target.find('.panel-group');
            var newtt = Math.random().toString(36).substring(7);
            var panel_default = $('<div/>', {
                'class':"panel panel-default"
            });
            var panel_heading = $('<div/>', {
                'class':"panel-heading",
                'role': 'tab',
                'data-toggle': 'collapse',
                'data-parent':panel_group.attr('id'),
                'data-target':"#myCollapseTab"+ newtt,
            }).appendTo(panel_default);

            $('<h4/>',{
                'class':"panel-title",
                'text': 'New',
            }).appendTo(panel_heading)
            var panel_collapse=$('<div/>',{
                'class':"panel-collapse collapse",
                'role':"tabpanel",
                'id':'myCollapseTab' + newtt,
            })
            panel_collapse.insertAfter(panel_heading);
            var panel_body=$('<div/>',{
                'class':'panel-body',
            })
            panel_body.appendTo(panel_collapse);
            $('<p/>',{
                'class':"o_default_snippet_text",
                'text':'Content',
            }).appendTo(panel_body);
            panel_group.append(panel_default);
          },
        _remove_current_tab: function() {
            var self = this;
            var tabs = self.$target.find('.panel-group');
            var panes = self.$target.find('.tab-content');

            if (tabs.find('> li[role="presentation"]').size() > 1 && panes.find('> div[role="tabpanel"]').size() > 1) {
                tabs.find('.active').remove();
                panes.find('.active').remove();
                tabs.find('> li[role="presentation"]:first').addClass('active');
                panes.find('> div[role="tabpanel"]:first').addClass('active');
            }
        },
    });

});