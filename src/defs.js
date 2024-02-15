export const PostSorting = {
	magic 		: "Magic",
	digs 		: "Digs",
	discussions : "Discussions",
	trending 	: "Trending",
	latest 		: "Latest",
}

export const PostCategories  = {
	meta 	: "Meta",
	tech 	: "Science & Tech",
	games 	: "Gaming",
	world 	: "World News",
	sport 	: "Sports",
	biz 	: "Business",
	life 	: "Lifestyle",
	media 	: "Entertainment",
	funny 	: "Funny",
	cute 	: "Cute Stuff",
	else 	: "Everything Else",
}

export const NewPostTypes = {
    link: 'link',
    text: 'text',
}

export const CommunityLinks = {
	faqs: "FAQs",
	rules: "Guidelines",
	cont: "Contact Us",
}

export const LegalLinks = {
	terms: "Terms of Use",
	priv: "Privacy Policy",
	cook: "Cookie Policy",
}

const PostSQL = /*sql*/`
CREATE TABLE IF NOT EXISTS posts ( 
    id            varchar(32) PRIMARY KEY, 
    post_id       varchar(32) NOT NULL, -- for root posts, id = post_id

    author_id     varchar(32) NOT NULL, 
    anonymous    boolean NOT NULL DEFAULT false,
    -- optional fields
    parent_id     varchar(32), -- for root posts, parent_id is null
    slug          varchar(32) UNIQUE, 
    category      varchar(8) , 
    type          varchar(4) ,
    title         varchar(256), 

    -- linked page data
    link          varchar(256), 
    thumb         varchar(256), 
    image           varchar(256),
    image_alt       varchar(256),
    favicon       varchar(256),
    
    og_title      varchar(256),
    og_desc       varchar(1024),
    og_image      varchar(256),
    og_image_alt  varchar(256),
    og_type       varchar(32),
    og_url        varchar(256),

    -- text content
    content       varchar(4096) NOT NULL, 

    -- stats
    digs_count    int NOT NULL DEFAULT 1, -- update every time user digs
    buries_count  int NOT NULL DEFAULT 0, -- NOT Implmented for now
    comments_count int NOT NULL DEFAULT 0, -- update every time user comments
    saves_count   int NOT NULL DEFAULT 0, -- update every time user saves
    
    -- comments_valueint NOT NULL, -- sum of all comments' digs. NOT Implmented for now
    -- total_value   int NOT NULL, -- digs count - buries count + avg comments value + saves count

    is_locked     boolean NOT NULL DEFAULT false,
    locked_for    varchar(256),

    created_at    timestamp NULL DEFAULT CURRENT_TIMESTAMP, 
    updated_at    timestamp NULL DEFAULT CURRENT_TIMESTAMP, 
    archived_at   timestamp , -- after n days, archive posts. archived posts are not shown in feed and are read only
    locked_at     timestamp , -- similar to archived_at but is done intentionally for posts which are running off course
    deleted_at    timestamp 
) ;
`

export const NewPostSchema = {
    titleMinLength : 16,
    titleMaxLength : 256,

    linkMinLength : 8,
    linkMaxLength : 256,

    contentMinLength : 32,
    contentMaxLength : 4096,
}
