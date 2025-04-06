import pandas as pd
import time
import random
import winreg
from bs4 import BeautifulSoup
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.service import Service

# Import managers and drivers
from webdriver_manager.chrome import ChromeDriverManager
from undetected_chromedriver import Chrome, ChromeOptions

def get_chrome_path():
    """
    Tries to retrieve the system-installed path to Chrome from the registry.
    Tries HKEY_LOCAL_MACHINE first, then HKEY_CURRENT_USER.
    Returns the path if found, otherwise None.
    """
    reg_paths = [
        (winreg.HKEY_LOCAL_MACHINE, r"SOFTWARE\Microsoft\Windows\CurrentVersion\App Paths\chrome.exe"),
        (winreg.HKEY_CURRENT_USER, r"SOFTWARE\Microsoft\Windows\CurrentVersion\App Paths\chrome.exe")
    ]
    for hkey, path in reg_paths:
        try:
            with winreg.OpenKey(hkey, path) as key:
                val, _ = winreg.QueryValueEx(key, "")
                return val
        except:
            continue
    return None

def get_driver():
    """
    Initialize undetected ChromeDriver with possible fallback
    to automatically locate Chrome if registry approach fails.
    """
    chrome_path = get_chrome_path()

    options = ChromeOptions()
    # Only specify binary_location if found in registry:
    if chrome_path:
        options.binary_location = chrome_path

    # Additional recommended options
    options.add_argument("--disable-blink-features=AutomationControlled")
    options.add_argument("--start-maximized")

    driver = Chrome(
        service=Service(ChromeDriverManager().install()),
        options=options
    )
    return driver

def scrape_season(driver, season, url):
    """
    Navigates to the given URL (FBref squad stats page), waits for table
    element to load, scrapes the stats table, and returns list of dictionaries.
    """
    try:
        driver.get(url)
        WebDriverWait(driver, 20).until(
            EC.presence_of_element_located((By.ID, "stats_standard_combined"))
        )
        # Random delay to mimic human browsing
        time.sleep(random.uniform(1, 3))

        soup = BeautifulSoup(driver.page_source, 'html.parser')
        table = soup.find('table', id='stats_standard_combined')

        # Second row of <thead> contains the actual column headers
        headers = [th.get('data-stat') for th in table.find('thead').find_all('tr')[1].find_all('th')]

        season_data = []
        for row in table.find('tbody').find_all('tr'):
            # Skip rows that are header dividers
            if 'over_header' in row.get('class', []):
                continue

            row_data = {'season': season}
            for header in headers:
                cell = row.find(['th', 'td'], {'data-stat': header})
                row_data[header] = cell.text.strip() if cell else None

            season_data.append(row_data)

        return season_data

    except Exception as e:
        print(f"Error scraping {season}: {str(e)}")
        return []

def main():
    """
    Main orchestration:
    1) Initialize driver
    2) Loop over seasons & URLs, scrape table
    3) Save combined data to CSV
    """
    seasons = [
        ('2024-2025', 'https://fbref.com/en/squads/cff3d9bb/2024-2025/all_comps/Chelsea-Stats-All-Competitions'),
        ('2023-2024', 'https://fbref.com/en/squads/cff3d9bb/2023-2024/all_comps/Chelsea-Stats-All-Competitions'),
        ('2022-2023', 'https://fbref.com/en/squads/cff3d9bb/2022-2023/all_comps/Chelsea-Stats-All-Competitions'),
        ('2021-2022', 'https://fbref.com/en/squads/cff3d9bb/2021-2022/all_comps/Chelsea-Stats-All-Competitions'),
        ('2020-2021', 'https://fbref.com/en/squads/cff3d9bb/2020-2021/all_comps/Chelsea-Stats-All-Competitions')
    ]

    driver = None
    all_data = []

    try:
        # Initialize driver with a robust fallback approach
        driver = get_driver()

        for season, url in seasons:
            # Scrape table for each season
            data = scrape_season(driver, season, url)
            if data:
                all_data.extend(data)

            # Random delay between requests
            time.sleep(random.uniform(5, 15))

            # Occasionally clear cookies for a clean session
            if random.random() > 0.7:
                driver.delete_all_cookies()

    finally:
        # Close driver in every scenario
        if driver:
            driver.quit()

    # If data was collected, save to CSV
    if all_data:
        df = pd.DataFrame(all_data)
        # Reorder columns to put 'season' in front
        df = df[['season'] + [col for col in df.columns if col != 'season']]
        df.to_csv('chelsea_data.csv', index=False)
        print("Data scraping complete. File saved: chelsea_data.csv")
    else:
        print("No data collected.")

if __name__ == '__main__':
    main()
