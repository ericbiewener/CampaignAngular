# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20150726185624) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "appearances", force: :cascade do |t|
    t.text    "properties"
    t.integer "user_id"
  end

  add_index "appearances", ["user_id"], name: "index_appearances_on_user_id", using: :btree

  create_table "comments", force: :cascade do |t|
    t.string   "text"
    t.integer  "user_id"
    t.integer  "policy_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_index "comments", ["policy_id"], name: "index_comments_on_policy_id", using: :btree
  add_index "comments", ["user_id"], name: "index_comments_on_user_id", using: :btree

  create_table "countries", force: :cascade do |t|
    t.string  "name",                           null: false
    t.integer "cached_votes_score", default: 0
  end

  add_index "countries", ["name"], name: "index_countries_on_name", using: :btree

  create_table "policies", force: :cascade do |t|
    t.string   "title"
    t.text     "description"
    t.string   "area"
    t.integer  "user_id"
    t.datetime "created_at"
    t.integer  "cached_votes_score", default: 0
  end

  add_index "policies", ["cached_votes_score"], name: "index_policies_on_cached_votes_score", using: :btree
  add_index "policies", ["user_id"], name: "index_policies_on_user_id", using: :btree

  create_table "users", force: :cascade do |t|
    t.string   "email",                                      null: false
    t.string   "username",                        limit: 25, null: false
    t.string   "crypted_password"
    t.string   "salt"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "reset_password_token"
    t.datetime "reset_password_token_expires_at"
    t.datetime "reset_password_email_sent_at"
    t.text     "avatar"
  end

  add_index "users", ["email"], name: "index_users_on_email", unique: true, using: :btree
  add_index "users", ["reset_password_token"], name: "index_users_on_reset_password_token", using: :btree
  add_index "users", ["username"], name: "index_users_on_username", unique: true, using: :btree

  create_table "votes", force: :cascade do |t|
    t.integer  "votable_id"
    t.string   "votable_type"
    t.integer  "voter_id"
    t.string   "voter_type"
    t.boolean  "vote_flag"
    t.string   "vote_scope"
    t.integer  "vote_weight"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "votes", ["votable_id", "votable_type", "vote_scope"], name: "index_votes_on_votable_id_and_votable_type_and_vote_scope", using: :btree
  add_index "votes", ["voter_id", "voter_type", "vote_scope"], name: "index_votes_on_voter_id_and_voter_type_and_vote_scope", using: :btree

  add_foreign_key "appearances", "users"
  add_foreign_key "comments", "policies"
  add_foreign_key "comments", "users"
  add_foreign_key "policies", "users"
end
