﻿define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/pagination'
], function (Backbone, $, _, Pagination) {
    'use strict';
    var View = Pagination.extend({
        el      : '#content-holder',
        filter  : null,
        viewType: 'thumbnails', // needs in view.prototype.changeLocationHash

        events: {
            'click #showMore'            : 'showMore',
            'click .thumbnail'           : 'gotoEditForm',
            'click .dropDown'            : 'dropDown',
            'click .filterButton'        : 'showfilter',
            'click .newSelectList li'    : 'chooseOption',
            'click .filter-check-list li': 'checkCheckbox'
        },

        initialize: function (options) {
            $(document).off('click');

            this.startTime = options.startTime;
            this.collection = options.collection || Backbone.Collection.extend();
            this.responseObj = {};
            this.filter = options.filter;

            this.render();
        },

        dropDown: function (e) {
            e.stopPropagation();
        },

        checkCheckbox: function (e) {
            var target$ = $(e.target);

            if (!target$.is('input')) {
                target$.closest('li').find('input').prop('checked', !target$.closest('li').find('input').prop('checked'));
            }
        },

        showfilter: function (e) {
            $('.filter-check-list').toggle();

            return false;
        },

        hide: function (e) {
            if (!$(e.target).closest('.filter-check-list').length) {
                $('.allNumberPerPage').hide();

                if ($('.filter-check-list').is(':visible')) {
                    $('.filter-check-list').hide();
                    this.showFilteredPage();
                }
            }
        },

        showFilteredPage: function (filter) {
            this.$el.find('.thumbnail').remove();
            this.startTime = new Date();

            this.filter = filter;

            if (Object.keys(filter).length === 0) {
                this.filter = {};
            }

            this.changeLocationHash(null, this.collection.pageSize, filter);
            this.collection.getFirstPage({filter: filter, showMore: true, viewType: this.viewType});
        },

        hideItemsNumber: function (e) {
            var el = e.target;

            this.$el.find('.allNumberPerPage, .newSelectList').hide();

            if (!el.closest('.search-view')) {
                $('.search-content').removeClass('fa-caret-up');
                this.$el.find('.search-options').addClass('hidden');
            }
        },

        showMore: function (e) {
            e.preventDefault();

            this.collection.getNextPage({filter: this.filter, showMore: true, viewType: this.viewType});
        },

        showMoreContent: function (newModels) {
            var $holder = this.$el;
            var $showMore = $holder.find('#showMoreDiv');
            var $created = $holder.find('#timeRecivingDataFromServer');
            var $content = $holder.find('#thumbnailContent');


            this.changeLocationHash(null, this.collection.pageSize, this.filter);

            if ($showMore.length !== 0) {
                $showMore.before(this.template({collection: this.collection.toJSON()}));

                $showMore.after($created);
            } else {
                $content.html(this.template({collection: this.collection.toJSON()}));
            }
            this.asyncLoadImgs(newModels);
            // this.filterView.renderFilterContent();
        },

        createItem: function () {
            var CreateView = this.CreateView || Backbone.View.extend({});

            return new CreateView();
        },

        editItem: function () {
            var EditView = this.EditView || Backbone.View.extend({});

            return new EditView({collection: this.collection});
        },

        setPagination: function () {
            var $thisEl = this.$el;
            var $showMore = $thisEl.find('#showMoreDiv');
            var $created = $thisEl.find('#timeRecivingDataFromServer');
            var collection = this.collection;
            var showMore = collection.currentPage < collection.totalPages;

            if (showMore) {
                if ($showMore.length === 0) {
                    $created.before('<div id="showMoreDiv"><input type="button" id="showMore" value="Show More"/></div>');
                } else {
                    $showMore.show();
                }
            } else {
                $showMore.hide();
            }
        }
    });

    View.extend = function (childView) {
        var view = Backbone.View.extend.apply(this, arguments);

        view.prototype.events = _.extend({}, this.prototype.events, childView.events);

        return view;
    };

    return View;
});