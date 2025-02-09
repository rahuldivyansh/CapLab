import GroupDocsBlock from "@/src/components/blocks/Groups/docs";
import DashboardLayout from "@/src/components/layouts/Dashboard";
import Button from "@/src/components/ui/Button";
import Layout from "@/src/components/ui/Layout";
import Typography from "@/src/components/ui/Typography";
import { ROLES } from "@/src/constants/roles";
import withAuthPage from "@/src/middlewares/withAuthPage";
import { Tab } from "@headlessui/react";
import React, { Fragment } from "react";
import GroupStatusBlock from "@/src/components/blocks/Groups/status";
import GroupMembersBlock from "@/src/components/blocks/Groups/members";
import GroupAboutBlock from "@/src/components/blocks/Groups/about";
import GroupDiscussions from "@/src/components/blocks/Groups/discussions";
import supabaseClient from "@/src/services/supabase";
import GroupProvider, { useGroup } from "@/src/providers/Group";
import Avatar from "@/src/components/elements/Avatar";
import {
  File,
  Info,
  ListTodo,
  MessageCircle,
  Settings,
  Users,
} from "lucide-react";
import GroupSettingsBlock from "@/src/components/blocks/Groups/settings";
import Page from "@/src/components/pages";
import GroupMilestonesBlock from "@/src/components/blocks/Groups/milestones";
import GradesBlock from "@/src/components/blocks/Groups/grades";
import { useAuth } from "@/src/providers/Auth";
import Contribution from "@/src/components/blocks/Groups/contribution";
import GradingPhasesBlock from "@/src/components/blocks/Groups/grading_phases";

const TAB_LABELS = [
  { label: "about", Icon: <Info className="ml-2" size={20} /> },
  { label: "status", Icon: <ListTodo className="ml-2" size={20} /> },
  { label: "documents", Icon: <File className="ml-2" size={20} /> },
  { label: "members", Icon: <Users className="ml-2" size={20} /> },
  { label: "discussions", Icon: <MessageCircle className="ml-2" size={20} /> },
  { label: "grades", Icon: <Info className="ml-2" size={20} /> },
  { label: "settings", Icon: <Settings className="ml-2" size={20} /> },
];

const GroupPage = (props) => {
  const { group } = props;
  const { id, num, session } = group;
  const auth = useAuth();
  return (
    <>
      <Page title={`Group-${num}-Session-${session}`}>
        <DashboardLayout>
          <Layout.Col className="bg-gray-100 dark:bg-background-dark">
            <Tab.Group>
              <Tab.List className="flex border-b bg-background-light dark:bg-background-dark dark:border-white/5 shadow-sm overflow-x-scroll scroll-bar-none sticky top-[3.5rem] sm:top-[3.8rem] right-0 z-10">
                <Layout.Row className="flex-nowrap">
                  {TAB_LABELS.map((tab, index) => (
                    <Tab as={Fragment} key={`group-page-tab-${index}`}>
                      {({ selected }) => (
                        <Button
                          className={`uppercase text-xs font-bold dark:font-medium hover:bg-secondary dark:hover:bg-secondary/10 rounded-none py-3 px-4 border-b-2 outline-none ${selected
                            ? "text-primary border-primary"
                            : " border-white dark:border-black text-gray-800 dark:text-white"
                            }`}
                        >
                          {tab.label} {tab.Icon}
                        </Button>
                      )}
                    </Tab>
                  ))}
                </Layout.Row>
              </Tab.List>
              <GroupProvider group={group}>
                <Tab.Panels>
                  <Tab.Panel>
                    <GroupAboutBlock />
                  </Tab.Panel>
                  <Tab.Panel>
                    <Tab.Group>
                      <Tab.List className="flex bg-white dark:bg-transparent">
                        {["tasks", "milestones"].map((tab, index) => (
                          <Tab key={`group-status-tab-${index}`} as={Fragment}>
                            {({ selected }) => (
                              <Button
                                className={`uppercase text-xs font-bold dark:font-medium hover:bg-secondary dark:hover:bg-secondary/10 rounded-none py-3 px-4 border-b-2 outline-none ${selected
                                  ? "text-primary border-primary"
                                  : " border-white dark:border-black text-gray-800 dark:text-white"
                                  }`}
                              >
                                {tab}
                              </Button>
                            )}
                          </Tab>
                        ))}
                      </Tab.List>
                      <Tab.Panels>
                        <Tab.Panel className="overflow-x-scroll outline-none scroll-bar-none">
                          <GroupStatusBlock />
                        </Tab.Panel>
                        <Tab.Panel>
                          <GroupMilestonesBlock />
                        </Tab.Panel>
                      </Tab.Panels>
                    </Tab.Group>
                  </Tab.Panel>
                  <Tab.Panel>
                    <GroupDocsBlock groupId={id} />
                  </Tab.Panel>
                  <Tab.Panel>
                    <GroupMembersBlock groupId={id} />
                  </Tab.Panel>
                  <Tab.Panel as={Fragment}>
                    <GroupDiscussions />
                  </Tab.Panel>
                  <Tab.Panel>
                    {auth.data?.app_meta.role == 2 ? (
                      <Tab.Group>
                        <Tab.List className="flex bg-white dark:bg-transparent">
                          {["Grades", "phases"].map((tab, index) => (
                            <Tab
                              key={`group-status-tab-${index}`}
                              as={Fragment}
                            >
                              {({ selected }) => (
                                <Button
                                  className={`uppercase text-xs font-bold dark:font-medium hover:bg-secondary dark:hover:bg-secondary/10 rounded-none py-3 px-4 border-b-2 outline-none ${selected
                                    ? "text-primary border-primary"
                                    : " border-white dark:border-black text-gray-800 dark:text-white"
                                    }`}
                                >
                                  {tab}
                                </Button>
                              )}
                            </Tab>
                          ))}
                        </Tab.List>
                        <Tab.Panels>
                          <Tab.Panel className="overflow-x-scroll outline-none scroll-bar-none">
                            <GradesBlock groupId={id} />
                          </Tab.Panel>
                          <Tab.Panel>
                            <GradingPhasesBlock />
                          </Tab.Panel>
                        </Tab.Panels>
                      </Tab.Group>
                    ) : (
                      <GradesBlock groupId={id} />
                    )}
                  </Tab.Panel>
                  <Tab.Panel>
                    <GroupSettingsBlock groupId={id} />
                  </Tab.Panel>
                </Tab.Panels>
              </GroupProvider>
            </Tab.Group>
          </Layout.Col>
        </DashboardLayout>
      </Page>
    </>
  );
};

export default GroupPage;

export const getServerSideProps = withAuthPage(async (ctx) => {
  const { id } = ctx.query;
  const { req } = ctx;
  const { role } = req;
  if (!id)
    return {
      notFound: true,
    };
  const ALLOWED_ROLES = [ROLES.TEACHER, ROLES.STUDENT];
  if (!ALLOWED_ROLES.includes(role)) {
    return {
      notFound: true,
    };
  }
  const { data: groupData, error: groupError } = await supabaseClient
    .from("groups")
    .select("*,users(name,email,uid)")
    .eq("id", id)
    .single();
  if (groupError || !groupData)
    return {
      notFound: true,
    };

  return {
    props: {
      info: "can be accessed by teachers and students only",
      group: groupData,
    },
  };
});
