library IEEE;
use IEEE.STD_LOGIC_1164.ALL;
use IEEE.STD_LOGIC_ARITH.ALL;
use IEEE.STD_LOGIC_UNSIGNED.ALL;

entity Register16 is
    	generic(
		data_length : integer := 16
	);
    	Port (
       		clk : in std_logic := '0';      
        	we  : in std_logic := '0';        
        	input   : in std_logic_vector(data_length - 1 downto 0):= (others => '0'); 
        	output   : out std_logic_vector(data_length - 1 downto 0):= (others => '0')
    	);
end Register16;


architecture Behavioral of Register16 is
    	signal reg : std_logic_vector(data_length - 1 downto 0) := (others => '0');
begin
    	process(clk)
    	begin
        	if rising_edge(clk) then
            		if we = '1' then
                		reg <= input;
            		end if;
        	end if;
    	end process;
    	output <= reg;
end Behavioral;
