'use strict';

// Create cacheing solution later.
// Menu service used for managing  menus



angular.module('system')
.service('Menus', [
    function () {
        // Define a set of default roles
        this.defaultRoles = ['*'];

        // Define the menus object
        this.menus     = {};
        
        // create a menu item buffer
        this.menuCache = {};
        
        // A private function for rendering decision 
        var shouldRender = function (user) {
            
            if (user.userId) { 
         
                if (!!~this.roles.indexOf('*')) {
                    return true;
                } else {
                    for (var userRoleIndex in user.userRoles) {
                        for (var roleIndex in this.roles) {
                            if (this.roles[roleIndex] === user.userRoles[userRoleIndex]) {
                                return true;
                            }
                        }
                    }
                }
            } else {
                return this.isPublic;
            }
            return false;
        };

        // Validate menu existance
        this.validateMenuExistance = function (menuId) {

            if (menuId && menuId.length) {
                if (this.menus[menuId]) {
                    return true;
                } else {
                    throw new Error('Menu does not exists');
                }
            } else {
                throw new Error('MenuId was not provided');
            }
            return false;
        };

        // Get the menu object by menu id
        this.getMenu = function (menuId) {

            // Validate that the menu exists
            this.validateMenuExistance(menuId);
            
            // Return the menu object
            return this.menus[menuId];
        };

        // Add new menu object by menu id
        this.addMenu = function (menuId, isPublic, roles) {

            // Create the new menu
  
            this.menus[menuId] = {
                isPublic: isPublic || true,
                roles: roles       || this.defaultRoles,
                items: [],
                shouldRender: shouldRender
            };

            // Return the menu object
            return this.menus[menuId];
        };

        // Remove existing menu object by menu id
        this.removeMenu = function (menuId) {
            // Validate that the menu exists
            this.validateMenuExistance(menuId);

            // Return the menu object
            delete this.menus[menuId];
        };

        // Add menu item object
        this.addMenuItem = function (query) {

            // Validate that the menu exists
            this.validateMenuExistance(query.id);

            // Push new menu item
            this.menus[query.id].items.push({
                title: query.title,
                method: query.method || null,
                link: query.URL,
                menuItemType: query.type || 'item',
                menuItemClass: query.class || query.type,
                uiRoute: query.UIRoute || ('/' + query.URL),
                isPublic: ((query.isPublic === null || typeof query.isPublic === 'undefined') ? this.menus[query.id].isPublic : query.isPublic),
                roles: ((query.roles === null || typeof query.roles === 'undefined') ? this.menus[query.id].roles : query.roles),
                position: query.position || 0,
                items:  [],
                shouldRender: shouldRender
            });

            // Return the menu object
            return this.menus[query.id];
        };
        
        // second level dropdown
        this.addSubItem = function(query){
            
        };
        
        // Add submenu item object
        this.addSubMenuItem = function (query) {

            var menuId          = query.id;
            var rootMenuItemURL = query.root;
            var menuItemTitle   = query.title;
            var menuMethod      = query.method || null;
            var menuItemURL     = query.URL;
            var menuItemUIRoute = query.UIRoute;
            var isPublic        = query.isPublic;
            var roles           = query.roles;
            var position        = query.position;

            // Validate that the menu exists
            this.validateMenuExistance(menuId);

            // Search for menu item
            for (var itemIndex in this.menus[menuId].items) {
                if (this.menus[menuId].items[itemIndex].link === rootMenuItemURL) {
                    // Push new submenu item
                    this.menus[menuId].items[itemIndex].items.push({
                        method: menuMethod,
                        title: menuItemTitle,
                        link: menuItemURL,
                        uiRoute: menuItemUIRoute || ('/' + menuItemURL),
                        isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].items[itemIndex].isPublic : isPublic),
                        roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].items[itemIndex].roles : roles),
                        position: position || 0,
                        shouldRender: shouldRender
                    });
                }
            }
            // Return the menu object
            return this.menus[menuId];
        };

        // Remove existing menu object by menu id
        this.removeMenuItem = function (menuId, menuItemURL) {
            // Validate that the menu exists
            this.validateMenuExistance(menuId);

            // Search for menu item to remove
            for (var itemIndex in this.menus[menuId].items) {
                if (this.menus[menuId].items[itemIndex].link === menuItemURL) {
                    this.menus[menuId].items.splice(itemIndex, 1);
                }
            }

            // Return the menu object
            return this.menus[menuId];
        };

        // Remove existing menu object by menu id
        this.removeSubMenuItem = function (menuId, submenuItemURL) {
            // Validate that the menu exists
            this.validateMenuExistance(menuId);

            // Search for menu item to remove
            for (var itemIndex in this.menus[menuId].items) {
                for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
                    if (this.menus[menuId].items[itemIndex].items[subitemIndex].link === submenuItemURL) {
                        this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
                    }
                }
            }

            // Return the menu object
             return this.menus[menuId];
        };
        this.addMenu('usermenu');
        this.addMenu('topbar');
        return this;

    }
]);