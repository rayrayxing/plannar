// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.

import React, { useState } from "react";
import * as echarts from "echarts";

const App: React.FC = () => {
  const [activeNav, setActiveNav] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Mock data for charts
  React.useEffect(() => {
    // Resource Utilization Chart
    const resourceChart = echarts.init(
      document.getElementById("resource-utilization-chart"),
    );
    const resourceOption = {
      animation: false,
      tooltip: {
        trigger: "item",
      },
      legend: {
        bottom: "0%",
        left: "center",
        itemWidth: 10,
        itemHeight: 10,
        textStyle: {
          fontSize: 10,
        },
      },
      series: [
        {
          name: "Resource Allocation",
          type: "pie",
          radius: ["40%", "70%"],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 4,
            borderColor: "#fff",
            borderWidth: 2,
          },
          label: {
            show: false,
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 12,
              fontWeight: "bold",
            },
          },
          labelLine: {
            show: false,
          },
          data: [
            { value: 48, name: "Allocated" },
            { value: 32, name: "Available" },
            { value: 15, name: "On Leave" },
            { value: 5, name: "Training" },
          ],
          color: ["#3B82F6", "#10B981", "#F59E0B", "#8B5CF6"],
        },
      ],
    };
    resourceChart.setOption(resourceOption);

    // Skill Coverage Chart
    const skillChart = echarts.init(
      document.getElementById("skill-coverage-chart"),
    );
    const skillOption = {
      animation: false,
      tooltip: {
        position: "top",
      },
      grid: {
        top: "10%",
        left: "3%",
        right: "4%",
        bottom: "10%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: ["Frontend", "Backend", "DevOps", "Design", "QA"],
        axisLabel: {
          fontSize: 10,
        },
      },
      yAxis: {
        type: "category",
        data: ["Team A", "Team B", "Team C", "Team D"],
        axisLabel: {
          fontSize: 10,
        },
      },
      visualMap: {
        min: 0,
        max: 10,
        calculable: true,
        orient: "horizontal",
        left: "center",
        bottom: "0%",
        textStyle: {
          fontSize: 10,
        },
      },
      series: [
        {
          name: "Skill Coverage",
          type: "heatmap",
          data: [
            [0, 0, 9],
            [0, 1, 7],
            [0, 2, 3],
            [0, 3, 5],
            [1, 0, 2],
            [1, 1, 8],
            [1, 2, 9],
            [1, 3, 4],
            [2, 0, 3],
            [2, 1, 5],
            [2, 2, 8],
            [2, 3, 2],
            [3, 0, 8],
            [3, 1, 2],
            [3, 2, 3],
            [3, 3, 7],
            [4, 0, 5],
            [4, 1, 6],
            [4, 2, 8],
            [4, 3, 9],
          ],
          label: {
            show: true,
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
          },
        },
      ],
    };
    skillChart.setOption(skillOption);

    // Budget Status Chart
    const budgetChart = echarts.init(
      document.getElementById("budget-status-chart"),
    );
    const budgetOption = {
      animation: false,
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      grid: {
        top: "10%",
        left: "3%",
        right: "4%",
        bottom: "10%",
        containLabel: true,
      },
      xAxis: {
        type: "value",
        max: 100,
        axisLabel: {
          fontSize: 10,
        },
      },
      yAxis: {
        type: "category",
        data: ["Project A", "Project B", "Project C", "Project D"],
        axisLabel: {
          fontSize: 10,
        },
      },
      series: [
        {
          name: "Spent",
          type: "bar",
          stack: "total",
          label: {
            show: true,
            position: "inside",
            formatter: "{c}%",
          },
          data: [65, 82, 45, 30],
          itemStyle: {
            color: "#3B82F6",
          },
        },
        {
          name: "Remaining",
          type: "bar",
          stack: "total",
          label: {
            show: true,
            position: "inside",
            formatter: "{c}%",
          },
          data: [35, 18, 55, 70],
          itemStyle: {
            color: "#E5E7EB",
          },
        },
      ],
    };
    budgetChart.setOption(budgetOption);

    // Project Timeline Chart
    const timelineChart = echarts.init(
      document.getElementById("project-timeline-chart"),
    );
    const timelineOption = {
      animation: false,
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      grid: {
        top: "10%",
        left: "3%",
        right: "4%",
        bottom: "10%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: ["May", "Jun", "Jul", "Aug", "Sep"],
        axisLabel: {
          fontSize: 10,
        },
      },
      yAxis: {
        type: "category",
        data: ["Project D", "Project C", "Project B", "Project A"],
        axisLabel: {
          fontSize: 10,
        },
      },
      series: [
        {
          type: "bar",
          stack: "total",
          barWidth: 20,
          data: [
            {
              value: 2,
              itemStyle: {
                color: "#3B82F6",
              },
            },
            {
              value: 3,
              itemStyle: {
                color: "#10B981",
              },
            },
            {
              value: 2,
              itemStyle: {
                color: "#F59E0B",
              },
            },
            {
              value: 4,
              itemStyle: {
                color: "#8B5CF6",
              },
            },
          ],
        },
      ],
    };
    timelineChart.setOption(timelineOption);

    // Handle resize
    const handleResize = () => {
      resourceChart.resize();
      skillChart.resize();
      budgetChart.resize();
      timelineChart.resize();
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      resourceChart.dispose();
      skillChart.dispose();
      budgetChart.dispose();
      timelineChart.dispose();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm h-16 flex items-center px-4 lg:px-8 z-10">
        <div className="flex items-center justify-between w-full">
          {/* Logo */}
          <div className="flex items-center">
            <div className="text-2xl font-bold text-blue-600 flex items-center">
              <i className="fas fa-calendar-alt mr-2"></i>
              <span>Plannar</span>
            </div>
          </div>

          {/* Search */}
          <div className="hidden md:flex items-center relative max-w-md w-full mx-4 lg:mx-8">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i className="fas fa-search text-gray-400"></i>
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Search resources, projects, skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Right side controls */}
          <div className="flex items-center space-x-4">
            <button
              className="relative p-2 text-gray-600 hover:text-blue-600 cursor-pointer"
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
            >
              <i className="fas fa-bell"></i>
              <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                3
              </span>
            </button>

            {/* Notification dropdown */}
            {isNotificationOpen && (
              <div className="absolute right-16 top-14 mt-2 w-80 bg-white rounded-lg shadow-lg z-20 border border-gray-200">
                <div className="p-3 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Notifications
                  </h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  <div className="p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 bg-red-100 rounded-full p-2">
                        <i className="fas fa-exclamation-triangle text-red-600"></i>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-800">
                          Resource conflict detected
                        </p>
                        <p className="text-xs text-gray-500">
                          John Doe is assigned to 2 projects on May 25
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          10 minutes ago
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 bg-amber-100 rounded-full p-2">
                        <i className="fas fa-clock text-amber-600"></i>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-800">
                          Project deadline approaching
                        </p>
                        <p className="text-xs text-gray-500">
                          Project A is due in 3 days
                        </p>
                        <p className="text-xs text-gray-400 mt-1">1 hour ago</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 bg-green-100 rounded-full p-2">
                        <i className="fas fa-user-plus text-green-600"></i>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-800">
                          New team member added
                        </p>
                        <p className="text-xs text-gray-500">
                          Sarah Johnson joined Team B
                        </p>
                        <p className="text-xs text-gray-400 mt-1">Yesterday</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-2 border-t border-gray-200 text-center">
                  <button className="text-sm text-blue-600 hover:text-blue-800 font-medium cursor-pointer whitespace-nowrap !rounded-button">
                    View all notifications
                  </button>
                </div>
              </div>
            )}

            <div className="relative">
              <button
                className="flex items-center cursor-pointer"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
              >
                <img
                  src="https://readdy.ai/api/search-image?query=professional%20headshot%20of%20a%20business%20person%20with%20neutral%20background%2C%20high%20quality%20corporate%20portrait%20photo%2C%20soft%20lighting%2C%20professional%20attire&width=40&height=40&seq=profile1&orientation=squarish"
                  alt="User profile"
                  className="h-8 w-8 rounded-full object-cover"
                />
                <span className="hidden md:block ml-2 text-sm font-medium text-gray-700">
                  Admin User
                </span>
                <i className="fas fa-chevron-down ml-1 text-gray-500 text-xs"></i>
              </button>

              {/* Profile dropdown */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-20 border border-gray-200">
                  <div className="py-1">
                    <a
                      href="#profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <i className="fas fa-user mr-2 text-gray-500"></i>
                      Profile
                    </a>
                    <a
                      href="#settings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <i className="fas fa-cog mr-2 text-gray-500"></i>
                      Settings
                    </a>
                    <a
                      href="#help"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <i className="fas fa-question-circle mr-2 text-gray-500"></i>
                      Help Center
                    </a>
                    <div className="border-t border-gray-100"></div>
                    <a
                      href="#logout"
                      className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      <i className="fas fa-sign-out-alt mr-2"></i>
                      Sign out
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile search - visible on small screens */}
      <div className="md:hidden p-2 bg-white border-b border-gray-200">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <i className="fas fa-search text-gray-400"></i>
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Navigation */}
        <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200">
          <nav className="flex-1 pt-5 pb-4 overflow-y-auto">
            <div className="px-2 space-y-1">
              <button
                className={`flex items-center px-2 py-2 text-sm font-medium rounded-lg w-full cursor-pointer whitespace-nowrap !rounded-button ${activeNav === "dashboard" ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}
                onClick={() => setActiveNav("dashboard")}
              >
                <i
                  className={`fas fa-th-large mr-3 ${activeNav === "dashboard" ? "text-blue-600" : "text-gray-400"}`}
                ></i>
                Dashboard
              </button>

              <button
                className={`flex items-center px-2 py-2 text-sm font-medium rounded-lg w-full cursor-pointer whitespace-nowrap !rounded-button ${activeNav === "resources" ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}
                onClick={() => setActiveNav("resources")}
              >
                <i
                  className={`fas fa-users mr-3 ${activeNav === "resources" ? "text-blue-600" : "text-gray-400"}`}
                ></i>
                Resources
              </button>

              <button
                className={`flex items-center px-2 py-2 text-sm font-medium rounded-lg w-full cursor-pointer whitespace-nowrap !rounded-button ${activeNav === "projects" ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}
                onClick={() => setActiveNav("projects")}
              >
                <i
                  className={`fas fa-folder mr-3 ${activeNav === "projects" ? "text-blue-600" : "text-gray-400"}`}
                ></i>
                Projects
              </button>

              <button
                className={`flex items-center px-2 py-2 text-sm font-medium rounded-lg w-full cursor-pointer whitespace-nowrap !rounded-button ${activeNav === "scheduling" ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}
                onClick={() => setActiveNav("scheduling")}
              >
                <i
                  className={`fas fa-calendar-alt mr-3 ${activeNav === "scheduling" ? "text-blue-600" : "text-gray-400"}`}
                ></i>
                Scheduling
              </button>

              <button
                className={`flex items-center px-2 py-2 text-sm font-medium rounded-lg w-full cursor-pointer whitespace-nowrap !rounded-button ${activeNav === "analytics" ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}
                onClick={() => setActiveNav("analytics")}
              >
                <i
                  className={`fas fa-chart-bar mr-3 ${activeNav === "analytics" ? "text-blue-600" : "text-gray-400"}`}
                ></i>
                Analytics
              </button>

              <button
                className={`flex items-center px-2 py-2 text-sm font-medium rounded-lg w-full cursor-pointer whitespace-nowrap !rounded-button ${activeNav === "settings" ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}
                onClick={() => setActiveNav("settings")}
              >
                <i
                  className={`fas fa-cog mr-3 ${activeNav === "settings" ? "text-blue-600" : "text-gray-400"}`}
                ></i>
                Settings
              </button>
            </div>
          </nav>

          <div className="p-4 border-t border-gray-200">
            <div className="bg-blue-50 p-3 rounded-lg">
              <h3 className="text-sm font-medium text-blue-800 mb-2">
                Need Help?
              </h3>
              <p className="text-xs text-blue-600 mb-3">
                Access tutorials and support resources
              </p>
              <button className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded cursor-pointer whitespace-nowrap !rounded-button">
                View Help Center
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 lg:p-6">
          <div className="max-w-7xl mx-auto">
            {/* Page header */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="mt-1 text-sm text-gray-500">
                Overview of resource allocation, project timelines, and
                scheduling
              </p>
            </div>

            {/* Dashboard Filters */}
            <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <div>
                  <label
                    htmlFor="time-period"
                    className="block text-xs font-medium text-gray-700 mb-1"
                  >
                    Time Period
                  </label>
                  <div className="relative">
                    <select
                      id="time-period"
                      className="block w-full pl-3 pr-10 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                    >
                      <option>This Month</option>
                      <option>Last Month</option>
                      <option>This Quarter</option>
                      <option>Custom Range</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                      <i className="fas fa-chevron-down text-gray-400 text-xs"></i>
                    </div>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="team-filter"
                    className="block text-xs font-medium text-gray-700 mb-1"
                  >
                    Team
                  </label>
                  <div className="relative">
                    <select
                      id="team-filter"
                      className="block w-full pl-3 pr-10 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                    >
                      <option>All Teams</option>
                      <option>Team A</option>
                      <option>Team B</option>
                      <option>Team C</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                      <i className="fas fa-chevron-down text-gray-400 text-xs"></i>
                    </div>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="project-filter"
                    className="block text-xs font-medium text-gray-700 mb-1"
                  >
                    Project
                  </label>
                  <div className="relative">
                    <select
                      id="project-filter"
                      className="block w-full pl-3 pr-10 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                    >
                      <option>All Projects</option>
                      <option>Project A</option>
                      <option>Project B</option>
                      <option>Project C</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                      <i className="fas fa-chevron-down text-gray-400 text-xs"></i>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer whitespace-nowrap !rounded-button">
                  <i className="fas fa-sliders-h mr-2"></i>
                  Advanced Filters
                </button>
              </div>
            </div>

            {/* Dashboard Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Resource Utilization */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                  <h2 className="text-sm font-medium text-gray-800">
                    Resource Utilization
                  </h2>
                  <div className="flex space-x-2">
                    <button className="text-gray-400 hover:text-gray-500 cursor-pointer">
                      <i className="fas fa-expand-alt text-xs"></i>
                    </button>
                    <button className="text-gray-400 hover:text-gray-500 cursor-pointer">
                      <i className="fas fa-ellipsis-v text-xs"></i>
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <div
                    id="resource-utilization-chart"
                    className="h-64 w-full"
                  ></div>
                </div>
                <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">
                      Total Resources: 120
                    </span>
                    <button className="text-xs text-blue-600 hover:text-blue-800 font-medium cursor-pointer whitespace-nowrap !rounded-button">
                      View Details
                    </button>
                  </div>
                </div>
              </div>

              {/* Project Timeline */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                  <h2 className="text-sm font-medium text-gray-800">
                    Project Timeline
                  </h2>
                  <div className="flex space-x-2">
                    <button className="text-gray-400 hover:text-gray-500 cursor-pointer">
                      <i className="fas fa-expand-alt text-xs"></i>
                    </button>
                    <button className="text-gray-400 hover:text-gray-500 cursor-pointer">
                      <i className="fas fa-ellipsis-v text-xs"></i>
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <div
                    id="project-timeline-chart"
                    className="h-64 w-full"
                  ></div>
                </div>
                <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">
                      4 Active Projects
                    </span>
                    <button className="text-xs text-blue-600 hover:text-blue-800 font-medium cursor-pointer whitespace-nowrap !rounded-button">
                      View Gantt Chart
                    </button>
                  </div>
                </div>
              </div>

              {/* Upcoming Deadlines */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                  <h2 className="text-sm font-medium text-gray-800">
                    Upcoming Deadlines
                  </h2>
                  <div className="flex space-x-2">
                    <button className="text-gray-400 hover:text-gray-500 cursor-pointer">
                      <i className="fas fa-expand-alt text-xs"></i>
                    </button>
                    <button className="text-gray-400 hover:text-gray-500 cursor-pointer">
                      <i className="fas fa-ellipsis-v text-xs"></i>
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <ul className="divide-y divide-gray-200">
                    <li className="py-3 flex justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          Project A: Phase 1
                        </p>
                        <p className="text-xs text-gray-500">Team B</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-medium text-red-600">
                          3 days left
                        </p>
                        <p className="text-xs text-gray-500">May 24, 2025</p>
                      </div>
                    </li>
                    <li className="py-3 flex justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          Project C: Deployment
                        </p>
                        <p className="text-xs text-gray-500">Team A</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-medium text-amber-600">
                          1 week left
                        </p>
                        <p className="text-xs text-gray-500">May 28, 2025</p>
                      </div>
                    </li>
                    <li className="py-3 flex justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          Project B: Testing
                        </p>
                        <p className="text-xs text-gray-500">Team C</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-medium text-green-600">
                          2 weeks left
                        </p>
                        <p className="text-xs text-gray-500">Jun 4, 2025</p>
                      </div>
                    </li>
                  </ul>
                </div>
                <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">
                      3 Upcoming Deadlines
                    </span>
                    <button className="text-xs text-blue-600 hover:text-blue-800 font-medium cursor-pointer whitespace-nowrap !rounded-button">
                      View Calendar
                    </button>
                  </div>
                </div>
              </div>

              {/* Scheduling Conflicts */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                  <h2 className="text-sm font-medium text-gray-800">
                    Scheduling Conflicts
                  </h2>
                  <div className="flex space-x-2">
                    <button className="text-gray-400 hover:text-gray-500 cursor-pointer">
                      <i className="fas fa-expand-alt text-xs"></i>
                    </button>
                    <button className="text-gray-400 hover:text-gray-500 cursor-pointer">
                      <i className="fas fa-ellipsis-v text-xs"></i>
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-3">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <i className="fas fa-exclamation-triangle text-red-600"></i>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">
                          John Doe
                        </h3>
                        <div className="mt-1 text-xs text-red-700">
                          <p>
                            Assigned to Project A and Project B on May 25, 2025
                          </p>
                          <p className="mt-1">
                            Overlapping: 10:00 AM - 12:30 PM
                          </p>
                        </div>
                        <div className="mt-2">
                          <button className="text-xs text-red-700 bg-red-100 hover:bg-red-200 px-2 py-1 rounded cursor-pointer whitespace-nowrap !rounded-button">
                            Resolve Conflict
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-md p-3 mb-3">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <i className="fas fa-exclamation-circle text-amber-600"></i>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-amber-800">
                          Sarah Johnson
                        </h3>
                        <div className="mt-1 text-xs text-amber-700">
                          <p>
                            Scheduled PTO conflicts with Project C deadline on
                            May 28, 2025
                          </p>
                        </div>
                        <div className="mt-2">
                          <button className="text-xs text-amber-700 bg-amber-100 hover:bg-amber-200 px-2 py-1 rounded cursor-pointer whitespace-nowrap !rounded-button">
                            Review Schedule
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">
                      2 Active Conflicts
                    </span>
                    <button className="text-xs text-blue-600 hover:text-blue-800 font-medium cursor-pointer whitespace-nowrap !rounded-button">
                      View All Conflicts
                    </button>
                  </div>
                </div>
              </div>

              {/* Skill Coverage */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                  <h2 className="text-sm font-medium text-gray-800">
                    Skill Coverage
                  </h2>
                  <div className="flex space-x-2">
                    <button className="text-gray-400 hover:text-gray-500 cursor-pointer">
                      <i className="fas fa-expand-alt text-xs"></i>
                    </button>
                    <button className="text-gray-400 hover:text-gray-500 cursor-pointer">
                      <i className="fas fa-ellipsis-v text-xs"></i>
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <div id="skill-coverage-chart" className="h-64 w-full"></div>
                </div>
                <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">
                      5 Skill Categories
                    </span>
                    <button className="text-xs text-blue-600 hover:text-blue-800 font-medium cursor-pointer whitespace-nowrap !rounded-button">
                      Skill Gap Analysis
                    </button>
                  </div>
                </div>
              </div>

              {/* Budget Status */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                  <h2 className="text-sm font-medium text-gray-800">
                    Budget Status
                  </h2>
                  <div className="flex space-x-2">
                    <button className="text-gray-400 hover:text-gray-500 cursor-pointer">
                      <i className="fas fa-expand-alt text-xs"></i>
                    </button>
                    <button className="text-gray-400 hover:text-gray-500 cursor-pointer">
                      <i className="fas fa-ellipsis-v text-xs"></i>
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <div id="budget-status-chart" className="h-64 w-full"></div>
                </div>
                <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">
                      Total Budget: $1.2M
                    </span>
                    <button className="text-xs text-blue-600 hover:text-blue-800 font-medium cursor-pointer whitespace-nowrap !rounded-button">
                      Financial Report
                    </button>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden md:col-span-2 lg:col-span-1">
                <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                  <h2 className="text-sm font-medium text-gray-800">
                    Recent Activity
                  </h2>
                  <div className="flex space-x-2">
                    <button className="text-gray-400 hover:text-gray-500 cursor-pointer">
                      <i className="fas fa-expand-alt text-xs"></i>
                    </button>
                    <button className="text-gray-400 hover:text-gray-500 cursor-pointer">
                      <i className="fas fa-ellipsis-v text-xs"></i>
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <ul className="divide-y divide-gray-200">
                    <li className="py-3 flex">
                      <div className="flex-shrink-0 mr-3">
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <i className="fas fa-user-plus text-blue-600 text-sm"></i>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-800">
                          <span className="font-medium">Sarah Johnson</span> was
                          added to <span className="font-medium">Team B</span>
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Today at 9:42 AM
                        </p>
                      </div>
                    </li>
                    <li className="py-3 flex">
                      <div className="flex-shrink-0 mr-3">
                        <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                          <i className="fas fa-tasks text-green-600 text-sm"></i>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-800">
                          <span className="font-medium">Project A</span>{" "}
                          milestone completed
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Yesterday at 4:15 PM
                        </p>
                      </div>
                    </li>
                    <li className="py-3 flex">
                      <div className="flex-shrink-0 mr-3">
                        <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center">
                          <i className="fas fa-calendar-alt text-amber-600 text-sm"></i>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-800">
                          <span className="font-medium">Project C</span>{" "}
                          deadline extended by 1 week
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          May 20, 2025
                        </p>
                      </div>
                    </li>
                    <li className="py-3 flex">
                      <div className="flex-shrink-0 mr-3">
                        <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                          <i className="fas fa-file-alt text-purple-600 text-sm"></i>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-800">
                          <span className="font-medium">
                            Resource allocation policy
                          </span>{" "}
                          was updated
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          May 19, 2025
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>
                <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">
                      4 Recent Activities
                    </span>
                    <button className="text-xs text-blue-600 hover:text-blue-800 font-medium cursor-pointer whitespace-nowrap !rounded-button">
                      View Activity Log
                    </button>
                  </div>
                </div>
              </div>

              {/* Team Availability */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden md:col-span-2 lg:col-span-2">
                <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                  <h2 className="text-sm font-medium text-gray-800">
                    Team Availability
                  </h2>
                  <div className="flex space-x-2">
                    <button className="text-gray-400 hover:text-gray-500 cursor-pointer">
                      <i className="fas fa-expand-alt text-xs"></i>
                    </button>
                    <button className="text-gray-400 hover:text-gray-500 cursor-pointer">
                      <i className="fas fa-ellipsis-v text-xs"></i>
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex space-x-1">
                      <button className="text-gray-500 hover:text-gray-700 px-2 py-1 text-sm cursor-pointer whitespace-nowrap !rounded-button">
                        <i className="fas fa-chevron-left"></i>
                      </button>
                      <span className="text-sm font-medium text-gray-700">
                        May 21 - May 27, 2025
                      </span>
                      <button className="text-gray-500 hover:text-gray-700 px-2 py-1 text-sm cursor-pointer whitespace-nowrap !rounded-button">
                        <i className="fas fa-chevron-right"></i>
                      </button>
                    </div>
                    <button className="text-xs text-blue-600 hover:text-blue-800 font-medium cursor-pointer whitespace-nowrap !rounded-button">
                      Today
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-40"
                          >
                            Team Member
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Wed
                            <br />
                            May 21
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Thu
                            <br />
                            May 22
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Fri
                            <br />
                            May 23
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Mon
                            <br />
                            May 26
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Tue
                            <br />
                            May 27
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                          <td className="px-3 py-2 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-8 w-8 rounded-full overflow-hidden">
                                <img
                                  src="https://readdy.ai/api/search-image?query=professional%20headshot%20of%20a%20business%20man%20with%20neutral%20background%2C%20high%20quality%20corporate%20portrait%20photo%2C%20soft%20lighting%2C%20professional%20attire&width=32&height=32&seq=person1&orientation=squarish"
                                  alt="John Doe"
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <div className="ml-2">
                                <div className="text-sm font-medium text-gray-900">
                                  John Doe
                                </div>
                                <div className="text-xs text-gray-500">
                                  Team A
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap">
                            <div className="text-xs text-center bg-green-100 text-green-800 py-1 px-2 rounded">
                              Available
                            </div>
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap">
                            <div className="text-xs text-center bg-blue-100 text-blue-800 py-1 px-2 rounded">
                              Project A
                            </div>
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap">
                            <div className="text-xs text-center bg-blue-100 text-blue-800 py-1 px-2 rounded">
                              Project A
                            </div>
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap">
                            <div className="text-xs text-center bg-red-100 text-red-800 py-1 px-2 rounded">
                              Conflict
                            </div>
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap">
                            <div className="text-xs text-center bg-blue-100 text-blue-800 py-1 px-2 rounded">
                              Project B
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-3 py-2 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-8 w-8 rounded-full overflow-hidden">
                                <img
                                  src="https://readdy.ai/api/search-image?query=professional%20headshot%20of%20a%20business%20woman%20with%20neutral%20background%2C%20high%20quality%20corporate%20portrait%20photo%2C%20soft%20lighting%2C%20professional%20attire&width=32&height=32&seq=person2&orientation=squarish"
                                  alt="Sarah Johnson"
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <div className="ml-2">
                                <div className="text-sm font-medium text-gray-900">
                                  Sarah Johnson
                                </div>
                                <div className="text-xs text-gray-500">
                                  Team B
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap">
                            <div className="text-xs text-center bg-blue-100 text-blue-800 py-1 px-2 rounded">
                              Project C
                            </div>
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap">
                            <div className="text-xs text-center bg-blue-100 text-blue-800 py-1 px-2 rounded">
                              Project C
                            </div>
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap">
                            <div className="text-xs text-center bg-green-100 text-green-800 py-1 px-2 rounded">
                              Available
                            </div>
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap">
                            <div className="text-xs text-center bg-amber-100 text-amber-800 py-1 px-2 rounded">
                              PTO
                            </div>
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap">
                            <div className="text-xs text-center bg-amber-100 text-amber-800 py-1 px-2 rounded">
                              PTO
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-3 py-2 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-8 w-8 rounded-full overflow-hidden">
                                <img
                                  src="https://readdy.ai/api/search-image?query=professional%20headshot%20of%20a%20business%20man%20with%20neutral%20background%2C%20high%20quality%20corporate%20portrait%20photo%2C%20soft%20lighting%2C%20professional%20attire&width=32&height=32&seq=person3&orientation=squarish"
                                  alt="Michael Smith"
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <div className="ml-2">
                                <div className="text-sm font-medium text-gray-900">
                                  Michael Smith
                                </div>
                                <div className="text-xs text-gray-500">
                                  Team C
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap">
                            <div className="text-xs text-center bg-purple-100 text-purple-800 py-1 px-2 rounded">
                              Training
                            </div>
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap">
                            <div className="text-xs text-center bg-purple-100 text-purple-800 py-1 px-2 rounded">
                              Training
                            </div>
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap">
                            <div className="text-xs text-center bg-green-100 text-green-800 py-1 px-2 rounded">
                              Available
                            </div>
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap">
                            <div className="text-xs text-center bg-blue-100 text-blue-800 py-1 px-2 rounded">
                              Project B
                            </div>
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap">
                            <div className="text-xs text-center bg-blue-100 text-blue-800 py-1 px-2 rounded">
                              Project B
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-4 text-xs">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
                        <span className="text-gray-600">Available</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-blue-500 mr-1"></div>
                        <span className="text-gray-600">Assigned</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-amber-500 mr-1"></div>
                        <span className="text-gray-600">PTO</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-red-500 mr-1"></div>
                        <span className="text-gray-600">Conflict</span>
                      </div>
                    </div>
                    <button className="text-xs text-blue-600 hover:text-blue-800 font-medium cursor-pointer whitespace-nowrap !rounded-button">
                      View Full Schedule
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Mobile bottom navigation */}
      <div className="md:hidden bg-white border-t border-gray-200 fixed bottom-0 left-0 right-0 z-10">
        <div className="grid grid-cols-5 h-16">
          <button
            className={`flex flex-col items-center justify-center cursor-pointer whitespace-nowrap !rounded-button ${activeNav === "dashboard" ? "text-blue-600" : "text-gray-500"}`}
            onClick={() => setActiveNav("dashboard")}
          >
            <i
              className={`fas fa-th-large text-lg ${activeNav === "dashboard" ? "text-blue-600" : "text-gray-400"}`}
            ></i>
            <span className="text-xs mt-1">Dashboard</span>
          </button>

          <button
            className={`flex flex-col items-center justify-center cursor-pointer whitespace-nowrap !rounded-button ${activeNav === "resources" ? "text-blue-600" : "text-gray-500"}`}
            onClick={() => setActiveNav("resources")}
          >
            <i
              className={`fas fa-users text-lg ${activeNav === "resources" ? "text-blue-600" : "text-gray-400"}`}
            ></i>
            <span className="text-xs mt-1">Resources</span>
          </button>

          <button
            className={`flex flex-col items-center justify-center cursor-pointer whitespace-nowrap !rounded-button ${activeNav === "projects" ? "text-blue-600" : "text-gray-500"}`}
            onClick={() => setActiveNav("projects")}
          >
            <i
              className={`fas fa-folder text-lg ${activeNav === "projects" ? "text-blue-600" : "text-gray-400"}`}
            ></i>
            <span className="text-xs mt-1">Projects</span>
          </button>

          <button
            className={`flex flex-col items-center justify-center cursor-pointer whitespace-nowrap !rounded-button ${activeNav === "scheduling" ? "text-blue-600" : "text-gray-500"}`}
            onClick={() => setActiveNav("scheduling")}
          >
            <i
              className={`fas fa-calendar-alt text-lg ${activeNav === "scheduling" ? "text-blue-600" : "text-gray-400"}`}
            ></i>
            <span className="text-xs mt-1">Schedule</span>
          </button>

          <button
            className={`flex flex-col items-center justify-center cursor-pointer whitespace-nowrap !rounded-button ${activeNav === "analytics" ? "text-blue-600" : "text-gray-500"}`}
            onClick={() => setActiveNav("analytics")}
          >
            <i
              className={`fas fa-chart-bar text-lg ${activeNav === "analytics" ? "text-blue-600" : "text-gray-400"}`}
            ></i>
            <span className="text-xs mt-1">Analytics</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
