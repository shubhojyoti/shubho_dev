# Shubho.Dev Gatsby Site

This is the repository for shubho.dev domain. The static site generator is Gatsby and the backend CMS is WordPress.

## Run a development server
1. Create a `.env.development` file in the root folder.
2. Update with the following env variables:
    ```
    BASE_WP_URL=<LOCAL_WORDPRESS_URL_WITHOUT_LEADING_http>
    BASE_PROTOCOL=http
    SOURCE_WP_URL=<PRODUCTION_WP_URL>
    DEST_WP_URL=<PRODUCTION_DOMAIN>
    REST_UN=<WP_REST_API_USERNAME>
    REST_PWD=<WP_REST_API_PWD>
    EMAIL=<AUTHOR_EMAIL>
    
    SITE_TITLE=<SITE_TITLE>
    SITE_DESCRIPTION=<SOME_DESCRIPTION>
    AUTHOR=<AUTHOR_NAME>
    SITE_URL=<SITE_URL>
    MAIN_PIC=<PROFILE_PIC_URL_FOR_HOMEPAGE>
    START_YEAR=2019
    INTRO_TAG_LINES=<SOME_INTRO_FOR_HOMEPAGE-Multiple lines separate by -_->
    ```
3. `yarn install`
4. `yarn start`. If you wish to use gatsby-cli install it globally and run `gatsby develop`.
